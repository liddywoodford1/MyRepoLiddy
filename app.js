const VALID_OPTIONS = ["Saj", "Manoushe", "Falafel", "Foul"];

const voteSection = document.getElementById("voteSection");
const votedSection = document.getElementById("votedSection");
const votedOptionEl = document.getElementById("votedOption");
const statusEl = document.getElementById("status");

function showVotedState(option) {
  voteSection.hidden = true;
  votedOptionEl.textContent = option;
  votedSection.hidden = false;
}

function setStatus(message, isError) {
  statusEl.textContent = message || "";
  statusEl.classList.toggle("error", Boolean(isError));
}

function getStoredVote() {
  try {
    if (localStorage.getItem("hasVoted") === "true") {
      return localStorage.getItem("votedOption");
    }
  } catch (e) {
    // localStorage unavailable (e.g. private mode) — just let them vote again.
  }
  return null;
}

function rememberVote(option) {
  try {
    localStorage.setItem("hasVoted", "true");
    localStorage.setItem("votedOption", option);
  } catch (e) {
    // ignore — not fatal if we can't persist the flag
  }
}

async function submitVote(option) {
  const buttons = voteSection.querySelectorAll(".vote-btn");
  buttons.forEach((btn) => (btn.disabled = true));
  setStatus("Submitting your vote...");

  const { error } = await window.supabaseClient
    .from("votes")
    .insert({ option });

  if (error) {
    setStatus("Something went wrong — please try again.", true);
    buttons.forEach((btn) => (btn.disabled = false));
    console.error(error);
    return;
  }

  rememberVote(option);
  setStatus("");
  showVotedState(option);
}

const existingVote = getStoredVote();
if (existingVote && VALID_OPTIONS.includes(existingVote)) {
  showVotedState(existingVote);
} else {
  voteSection.querySelectorAll(".vote-btn").forEach((btn) => {
    btn.addEventListener("click", () => submitVote(btn.dataset.option));
  });
}
