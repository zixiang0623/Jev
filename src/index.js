// このファイルはリポジトリの src/index.js に置いてください。
// wrangler.toml で [assets] directory="./public" を設定していれば、
// GET/HEAD は index.html が自動配信され、それ以外（POST）だけこの fetch が呼ばれます。

export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch (err) {
        return new Response(JSON.stringify({ error: "invalid JSON body" }), {
          status: 400,
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      }

      try {
        const result = await env.AI.run("typesafe/jev", body);
        return new Response(JSON.stringify(result), {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: String(err && err.message ? err.message : err) }),
          { status: 500, headers: { "content-type": "application/json; charset=utf-8" } }
        );
      }
    }

    // 念のためのフォールバック（通常はASSETSバインディングが直接GETを処理する）
    return env.ASSETS.fetch(request);
  }
};
