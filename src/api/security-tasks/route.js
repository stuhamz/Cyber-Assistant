async function handler({
  method,
  taskId,
  title,
  description,
  priority,
  completed,
  page = 1,
  perPage = 10,
  filterCompleted,
}) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (method === "GET") {
    const offset = (page - 1) * perPage;
    let queryStr = "SELECT * FROM security_tasks WHERE user_id = $1";
    const queryParams = [session.user.id];
    let paramCount = 1;

    if (filterCompleted !== undefined) {
      paramCount++;
      queryStr += ` AND is_completed = $${paramCount}`;
      queryParams.push(filterCompleted);
    }

    queryStr += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${
      paramCount + 2
    }`;
    queryParams.push(perPage, offset);

    const tasks = await sql(queryStr, queryParams);
    const [{ count }] = await sql(
      "SELECT COUNT(*) FROM security_tasks WHERE user_id = $1",
      [session.user.id]
    );

    return {
      tasks,
      pagination: {
        total: parseInt(count),
        pages: Math.ceil(count / perPage),
        current: page,
        perPage,
      },
    };
  }

  if (method === "POST") {
    if (!title || !description || !priority) {
      return { error: "Missing required fields" };
    }

    const [task] = await sql`
      INSERT INTO security_tasks 
      (user_id, title, description, priority)
      VALUES 
      (${session.user.id}, ${title}, ${description}, ${priority})
      RETURNING *
    `;
    return { task };
  }

  if (method === "PATCH" && taskId) {
    const updates = [];
    const values = [taskId, session.user.id];
    let paramCount = 2;

    if (completed !== undefined) {
      paramCount++;
      updates.push(`is_completed = $${paramCount}`);
      values.push(completed);
    }

    if (priority) {
      paramCount++;
      updates.push(`priority = $${paramCount}`);
      values.push(priority);
    }

    if (updates.length === 0) {
      return { error: "No updates provided" };
    }

    const queryStr = `
      UPDATE security_tasks 
      SET ${updates.join(", ")}
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const [updatedTask] = await sql(queryStr, values);

    if (!updatedTask) {
      return { error: "Task not found or unauthorized" };
    }

    return { task: updatedTask };
  }

  return { error: "Method not allowed" };
}
export async function POST(request) {
  return handler(await request.json());
}