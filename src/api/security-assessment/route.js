async function handler({ method, userId, passwordStrength, twoFactorEnabled }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (method === "GET") {
    const assessment = await sql`
      SELECT * FROM security_assessment 
      WHERE user_id = ${session.user.id} 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    if (assessment.length === 0) {
      return { status: "not_found" };
    }

    return { assessment: assessment[0] };
  }

  if (method === "POST") {
    const passwordScore = passwordStrength || 0;
    const overallScore = calculateOverallScore(passwordScore, twoFactorEnabled);

    const [assessment] = await sql.transaction([
      sql`
        INSERT INTO security_assessment 
        (user_id, overall_score, password_strength_score, two_factor_enabled)
        VALUES 
        (${session.user.id}, ${overallScore}, ${passwordScore}, ${twoFactorEnabled})
        RETURNING *
      `,
      sql`
        INSERT INTO security_tasks 
        (user_id, title, description, priority)
        SELECT 
          ${session.user.id},
          'Enable two-factor authentication',
          'Enhance your account security by enabling 2FA',
          'high'
        WHERE NOT ${twoFactorEnabled}
      `,
      sql`
        INSERT INTO security_alerts 
        (user_id, alert_type, severity, message)
        SELECT 
          ${session.user.id},
          'security_score',
          CASE 
            WHEN ${overallScore} < 50 THEN 'high'
            WHEN ${overallScore} < 70 THEN 'medium'
            ELSE 'low'
          END,
          CASE 
            WHEN ${overallScore} < 50 THEN 'Your security score is critically low. Take immediate action.'
            WHEN ${overallScore} < 70 THEN 'Your security score needs improvement.'
            ELSE 'Your security score is good.'
          END
      `,
    ]);

    return { assessment };
  }

  return { error: "Method not allowed" };
}

function calculateOverallScore(passwordScore, twoFactorEnabled) {
  const baseScore = passwordScore * 0.7;
  const twoFactorScore = twoFactorEnabled ? 30 : 0;
  return Math.min(Math.round(baseScore + twoFactorScore), 100);
}
export async function POST(request) {
  return handler(await request.json());
}