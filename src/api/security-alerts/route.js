async function handler({
  method,
  page = 1,
  perPage = 10,
  severity,
  alertId,
  resolved,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (method === "GET") {
    const offset = (page - 1) * perPage;
    let queryStr = "SELECT * FROM security_alerts WHERE user_id = $1";
    const queryParams = [session.user.id];
    let paramCount = 1;

    if (severity) {
      paramCount++;
      queryStr += ` AND severity = $${paramCount}`;
      queryParams.push(severity);
    }

    queryStr += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${
      paramCount + 2
    }`;
    queryParams.push(perPage, offset);

    const alerts = await sql(queryStr, queryParams);
    const [{ count }] = await sql(
      "SELECT COUNT(*) FROM security_alerts WHERE user_id = $1",
      [session.user.id]
    );

    return {
      alerts,
      pagination: {
        total: parseInt(count),
        pages: Math.ceil(count / perPage),
        current: page,
        perPage,
      },
    };
  }

  if (method === "POST") {
    const [alert] = await sql`
      INSERT INTO security_alerts 
      (user_id, alert_type, severity, message)
      VALUES 
      (${session.user.id}, ${alertId}, ${severity}, ${resolved})
      RETURNING *
    `;
    return { alert };
  }

  if (method === "PATCH" && alertId) {
    const [updatedAlert] = await sql`
      UPDATE security_alerts 
      SET is_resolved = ${resolved}
      WHERE id = ${alertId} 
      AND user_id = ${session.user.id}
      RETURNING *
    `;

    if (!updatedAlert) {
      return { error: "Alert not found or unauthorized" };
    }

    return { alert: updatedAlert };
  }

  return { error: "Method not allowed" };
}
export async function POST(request) {
  return handler(await request.json());
}