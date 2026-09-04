// Shared Supabase client, built from window.SUPABASE_CONFIG (see config.js / config.example.js).
(function () {
  const config = window.SUPABASE_CONFIG;

  if (!config || !config.url || !config.anonKey || config.anonKey === "YOUR-ANON-PUBLIC-KEY") {
    document.addEventListener("DOMContentLoaded", () => {
      document.body.innerHTML =
        '<div style="max-width:480px;margin:60px auto;padding:20px;font-family:sans-serif;text-align:center;color:#b8532c;">' +
        "<h2>Missing Supabase config</h2>" +
        "<p>Copy <code>config.example.js</code> to <code>config.js</code> and fill in your Supabase project URL and anon key.</p>" +
        "</div>";
    });
    throw new Error("Missing Supabase config — see config.example.js");
  }

  window.supabaseClient = window.supabase.createClient(config.url, config.anonKey);
})();
