const VALID_OPTIONS = ["Saj", "Manoushe", "Falafel", "Foul"];

const totalCountEl = document.getElementById("totalCount");

function render(counts) {
  const total = VALID_OPTIONS.reduce((sum, opt) => sum + (counts[opt] || 0), 0);
  totalCountEl.textContent = total;

  VALID_OPTIONS.forEach((option) => {
    const count = counts[option] || 0;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    document.querySelector(`.bar-fill[data-option="${option}"]`).style.width = pct + "%";
    document.querySelector(`.pct[data-pct="${option}"]`).textContent = pct + "%";
  });
}

async function loadResults() {
  const { data, error } = await window.supabaseClient.from("votes").select("option");

  if (error) {
    console.error(error);
    return;
  }

  const counts = {};
  (data || []).forEach((row) => {
    counts[row.option] = (counts[row.option] || 0) + 1;
  });

  render(counts);
}

loadResults();

window.supabaseClient
  .channel("votes-realtime")
  .on("postgres_changes", { event: "INSERT", schema: "public", table: "votes" }, () => {
    loadResults();
  })
  .subscribe();
