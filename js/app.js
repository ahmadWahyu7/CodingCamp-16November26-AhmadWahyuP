// ============================================================
// localStorage Helpers
// ============================================================

function safeGet(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    console.warn("localStorage tidak tersedia. Data tidak disimpan.");
  }
}

// ============================================================
// GreetingModule — clock, date, greeting (Tasks 4.1–4.4)
// ============================================================

const GreetingModule = {
  // ---- internal state ----
  _intervalId: null,
  _watchdogId: null,
  _lastTickTime: null,
  _name: "", // cached username, populated by loadName()

  // ---- public API ----

  init() {
    this.loadName(); // read and cache persisted name
    this.startClock(); // start ticking immediately
    this.startWatchdog(); // monitor clock health
    this.renderGreeting();
    this._bindEvents(); // wire up name dialog events

    // Tampilkan dialog jika belum ada nama tersimpan
    if (!this._name) {
      this.openNameDialog();
    }
  },

  openNameDialog() {
    const dialog = document.getElementById("name-dialog");
    const input = document.getElementById("name-input");
    const title = document.getElementById("name-dialog-title");
    const cancelBtn = document.getElementById("name-cancel-btn");

    if (!dialog || !input) return;

    // Isi dengan nama yang tersimpan
    input.value = this._name;

    // Sesuaikan judul dan tombol
    if (title) {
      title.textContent = this._name ? "Ubah Nama" : "Selamat Datang!";
    }

    if (cancelBtn) {
      cancelBtn.classList.toggle("hidden", !this._name);
    }

    dialog.showModal();
    input.focus();
  },

  startClock() {
    // Fire once immediately so the display is populated before the first tick
    this.updateDisplay(new Date());
    this._intervalId = setInterval(() => {
      this.updateDisplay(new Date());
    }, 1000);
  },

  startWatchdog() {
    this._watchdogId = setInterval(() => {
      const errorEl = document.getElementById("clock-error");
      if (!errorEl) return;
      if (
        this._lastTickTime !== null &&
        Date.now() - this._lastTickTime > 2000
      ) {
        errorEl.classList.remove("hidden");
      } else {
        errorEl.classList.add("hidden");
      }
    }, 3000);
  },

  updateDisplay(date) {
    this._lastTickTime = Date.now();

    const timeEl = document.getElementById("clock-display");
    const dateEl = document.getElementById("date-display");

    if (timeEl) timeEl.textContent = this.formatTime(date);
    if (dateEl) dateEl.textContent = this.formatDate(date);

    this.renderGreeting();
  },

  /**
   * Returns "HH:MM:SS" with two-digit padding.
   * @param {Date} date
   * @returns {string}
   */
  formatTime(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  },

  /**
   * Returns a full Indonesian date string, e.g. "Senin, 20 November 2026".
   * @param {Date} date
   * @returns {string}
   */
  formatDate(date) {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  },

  // ---- name persistence (task 4.4) ----

  /**
   * Persists the username to localStorage.
   * If name is blank/whitespace-only, stores an empty string (greeting shown without name).
   * @param {string} name
   */
  saveName(name) {
    const trimmed = name.trim();
    safeSet("tl_username", trimmed);
    this._name = trimmed;
  },

  /**
   * Reads the username from localStorage and caches it in _name.
   * Falls back to empty string if nothing is stored.
   */
  loadName() {
    this._name = safeGet("tl_username", "").trim();
  },

  /**
   * Wires up the save button (click) and name input (Enter key).
   * Called once from init().
   */

  _bindEvents() {
    const dialog = document.getElementById("name-dialog");
    const form = document.getElementById("name-form");
    const input = document.getElementById("name-input");
    const changeBtn = document.getElementById("change-name-btn");
    const cancelBtn = document.getElementById("name-cancel-btn");

    if (!dialog || !form || !input) return;

    // Tombol Ubah Nama
    if (changeBtn) {
      changeBtn.addEventListener("click", () => {
        this.openNameDialog();
      });
    }

    // Tombol Batal
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        dialog.close();
      });
    }

    // Simpan nama
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = input.value.trim();

      if (!name) {
        input.setCustomValidity("Nama tidak boleh kosong.");
        input.reportValidity();
        return;
      }

      input.setCustomValidity("");

      this.saveName(name);
      this.renderGreeting();
      dialog.close();
    });

    // Hapus pesan validasi ketika pengguna mengetik
    input.addEventListener("input", () => {
      input.setCustomValidity("");
    });

    // Cegah dialog ditutup saat nama pertama belum diisi
    dialog.addEventListener("cancel", (e) => {
      if (!this._name) {
        e.preventDefault();
      }
    });
  },

  /**
   * Returns an Indonesian greeting based on the hour (0–23).
   * Returns "Selamat Datang" for any invalid input.
   * @param {number} hour
   * @returns {string}
   */
  getGreeting(hour) {
    if (
      hour === null ||
      hour === undefined ||
      typeof hour !== "number" ||
      !Number.isInteger(hour) ||
      hour < 0 ||
      hour > 23
    ) {
      return "Selamat Datang";
    }
    if (hour >= 5 && hour <= 11) return "Selamat Pagi";
    if (hour >= 12 && hour <= 14) return "Selamat Siang";
    if (hour >= 15 && hour <= 17) return "Selamat Sore";
    return "Selamat Malam"; // 18–23 and 0–4
  },

  /**
   * Updates #greeting-text with the time-appropriate greeting and stored name.
   * e.g. "Selamat Pagi, Ahmad!" or "Selamat Pagi!"
   * Reads from the cached _name rather than hitting localStorage every tick.
   */
  renderGreeting() {
    const el = document.getElementById("greeting-text");
    if (!el) return;

    let hour;
    try {
      hour = new Date().getHours();
    } catch {
      hour = null;
    }

    const greeting = this.getGreeting(hour);
    const name = this._name || "";
    el.textContent = name ? `${greeting}, ${name}!` : `${greeting}!`;
  },
};

// ============================================================
// TimerModule — Focus Timer (Tasks 5.1–5.4)
// ============================================================

const TimerModule = {
  // ---- state ----
  intervalId: null,
  remainingSeconds: 0,
  activeDurationMinutes: 25,
  pendingDurationMinutes: null,

  // ---- public API ----

  init() {
    this.loadDuration();
    this.remainingSeconds = this.loadRemaining();
    this.updateDisplay();
    this._bindEvents();
  },

  /**
   * Reads the saved duration from localStorage.
   * Falls back to 25 if the stored value is missing, non-numeric, or outside 1–120.
   */
  loadDuration() {
    const raw = safeGet("tl_timer_duration", null);
    const parsed = parseInt(raw, 10);
    this.activeDurationMinutes =
      Number.isInteger(parsed) && parsed >= 1 && parsed <= 120 ? parsed : 25;
  },

  /**
   * Persists remainingSeconds to localStorage (key: tl_timer_remaining).
   * Called by stop(), reset(), and onComplete() to survive page reloads.
   */
  saveRemaining() {
    safeSet("tl_timer_remaining", String(this.remainingSeconds));
  },

  /**
   * Reads the persisted remainingSeconds from localStorage.
   * Clamps to [0, activeDurationMinutes * 60]; falls back to the full
   * duration if the stored value is missing or invalid.
   * Must be called after loadDuration() so activeDurationMinutes is set.
   * @returns {number}
   */
  loadRemaining() {
    const max = this.activeDurationMinutes * 60;
    const raw = safeGet("tl_timer_remaining", null);
    if (raw === null) return max;
    const parsed = parseInt(raw, 10);
    if (!Number.isInteger(parsed) || parsed < 0) return max;
    return Math.min(parsed, max);
  },

  /**
   * Validates and persists a new duration in minutes.
   * - Valid (1–120): saves to localStorage, updates activeDurationMinutes,
   *   resets display if the timer is idle, hides the error element.
   * - Invalid: shows the error element, makes no other changes.
   * - If the timer is running, stores the value in pendingDurationMinutes
   *   instead of applying it immediately.
   * @param {number} minutes
   */
  saveDuration(minutes) {
    const errorEl = document.getElementById("timer-duration-error");

    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) {
      if (errorEl) errorEl.classList.remove("hidden");
      return;
    }

    if (errorEl) errorEl.classList.add("hidden");
    safeSet("tl_timer_duration", String(minutes));

    if (this.intervalId !== null) {
      // Timer is running — defer until reset or completion
      this.pendingDurationMinutes = minutes;
    } else {
      this.activeDurationMinutes = minutes;
      this.remainingSeconds = minutes * 60;
      this.saveRemaining();
      this.updateDisplay();
    }
  },

  /**
   * Returns a "MM:SS" string with two-digit padding.
   * @param {number} seconds
   * @returns {string}
   */
  formatMMSS(seconds) {
    const totalSeconds = Math.max(0, Math.floor(seconds));
    const mm = Math.floor(totalSeconds / 60);
    const ss = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(mm)}:${pad(ss)}`;
  },

  /**
   * Writes the formatted remaining time to #timer-display.
   */
  updateDisplay() {
    const el = document.getElementById("timer-display");
    if (el) el.textContent = this.formatMMSS(this.remainingSeconds);
  },

  /**
   * Starts the countdown. Does nothing if the timer is already running.
   */
  start() {
    if (this.intervalId !== null) return; // already running
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.setButtonState(true);
  },

  /**
   * Called every second by the interval. Decrements remainingSeconds and
   * updates the display; triggers onComplete() when the countdown reaches zero.
   */
  tick() {
    this.remainingSeconds -= 1;
    this.updateDisplay();
    if (this.remainingSeconds <= 0) {
      this.onComplete();
    }
  },

  /**
   * Pauses the countdown without resetting the remaining time.
   * Persists the current remaining time so it survives a page reload.
   */
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.setButtonState(false);
    this.saveRemaining();
  },

  /**
   * Stops the countdown and restores the display to the full active duration.
   * If a pendingDurationMinutes was set while the timer was running, it is
   * applied now before recalculating remainingSeconds.
   */
  reset() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    if (this.pendingDurationMinutes !== null) {
      this.activeDurationMinutes = this.pendingDurationMinutes;
      this.pendingDurationMinutes = null;
    }
    this.remainingSeconds = this.activeDurationMinutes * 60;
    this.saveRemaining();
    this.updateDisplay();
    this.setButtonState(false);
  },

  /**
   * Called when the countdown reaches zero.
   * Clears the interval, applies any pending duration, resets button state,
   * persists zero, and shows the completion notification.
   */
  onComplete() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    if (this.pendingDurationMinutes !== null) {
      this.activeDurationMinutes = this.pendingDurationMinutes;
      this.pendingDurationMinutes = null;
    }
    this.remainingSeconds = 0;
    this.setButtonState(false);
    this.saveRemaining();

    const notification = document.getElementById("timer-complete-notification");
    if (notification) notification.classList.remove("hidden");
  },

  /**
   * Reflects the running/stopped state on the Start button.
   * When running, the button is disabled; when stopped, it is re-enabled.
   * @param {boolean} isRunning
   */
  setButtonState(isRunning) {
    const startBtn = document.getElementById("timer-start-btn");
    if (!startBtn) return;
    startBtn.disabled = isRunning;
    startBtn.classList.toggle("opacity-50", isRunning);
    startBtn.classList.toggle("cursor-not-allowed", isRunning);
  },

  /**
   * Wires up the three timer control buttons, the dismiss button for the
   * completion notification, and the duration save controls.
   * Called once from init().
   */
  _bindEvents() {
    const startBtn = document.getElementById("timer-start-btn");
    const stopBtn = document.getElementById("timer-stop-btn");
    const resetBtn = document.getElementById("timer-reset-btn");
    const dismissBtn = document.getElementById("timer-dismiss-btn");
    const saveDurBtn = document.getElementById("timer-save-duration-btn");
    const durationInput = document.getElementById("timer-duration-input");

    if (startBtn) startBtn.addEventListener("click", () => this.start());
    if (stopBtn) stopBtn.addEventListener("click", () => this.stop());
    if (resetBtn) resetBtn.addEventListener("click", () => this.reset());

    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        const notification = document.getElementById(
          "timer-complete-notification",
        );
        if (notification) notification.classList.add("hidden");
      });
    }

    const handleSaveDuration = () => {
      if (!durationInput) return;
      const minutes = parseInt(durationInput.value, 10);
      this.saveDuration(minutes);
    };

    if (saveDurBtn) saveDurBtn.addEventListener("click", handleSaveDuration);
    if (durationInput) {
      durationInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSaveDuration();
      });
    }
  },
};
// ============================================================
// TodoModule — To-Do List (Tasks 6.1–6.4)
// ============================================================

const TodoModule = {
  // ---- state ----
  tasks: [],

  // ---- public API ----

  /**
   * Reads the task list from localStorage.
   * Falls back to [] if the stored value is missing or cannot be parsed.
   * @returns {Array}
   */
  loadTasks() {
    const raw = safeGet("tl_tasks", "[]");
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  /**
   * Persists the current task list to localStorage.
   */
  saveTasks() {
    safeSet("tl_tasks", JSON.stringify(this.tasks));
  },

  /**
   * Creates and returns a `<li>` element representing a single task.
   * The element contains:
   *   - A toggle button  [data-action="toggle"][data-id="{task.id}"]
   *   - A <span> with the task text (class "line-through" when task.done === true)
   *   - An edit button   [data-action="edit"][data-id="{task.id}"]
   *   - A delete button  [data-action="delete"][data-id="{task.id}"]
   * @param {{ id: string, text: string, done: boolean }} task
   * @returns {HTMLLIElement}
   */
  renderTask(task) {
    const li = document.createElement("li");
    li.className =
      "flex items-center gap-2 p-2 rounded-lg bg-white/30 dark:bg-white/10";

    // Toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.dataset.action = "toggle";
    toggleBtn.dataset.id = task.id;
    toggleBtn.className =
      "min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg font-semibold";
    toggleBtn.setAttribute(
      "aria-label",
      task.done ? "Tandai belum selesai" : "Tandai selesai",
    );
    toggleBtn.textContent = task.done ? "✅" : "⬜";

    // Task text
    const span = document.createElement("span");
    span.className =
      "flex-1 break-words" + (task.done ? " line-through opacity-60" : "");
    span.textContent = task.text;

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.dataset.action = "edit";
    editBtn.dataset.id = task.id;
    editBtn.className =
      "min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg font-semibold";
    editBtn.setAttribute("aria-label", "Edit tugas");
    editBtn.textContent = "✏️";

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = task.id;
    deleteBtn.className =
      "min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg font-semibold";
    deleteBtn.setAttribute("aria-label", "Hapus tugas");
    deleteBtn.textContent = "🗑️";

    li.appendChild(toggleBtn);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
  },

  /**
   * Clears #todo-list and re-renders every task in this.tasks.
   */
  renderAll() {
    const list = document.getElementById("todo-list");
    if (!list) return;

    list.innerHTML = "";
    this.tasks.forEach((task) => {
      list.appendChild(this.renderTask(task));
    });
  },

  /**
   * Adds a new task from the given text.
   * - Trims whitespace; shows #todo-empty-warning and returns if the result is empty.
   * - Otherwise creates { id, text, done: false, createdAt }, pushes it, persists,
   *   re-renders, clears the input, and hides the warning.
   * @param {string} text
   */
  addTask(text) {
    const trimmed = typeof text === "string" ? text.trim() : "";
    const warningEl = document.getElementById("todo-empty-warning");
    const inputEl = document.getElementById("todo-input");

    if (trimmed === "") {
      if (warningEl) warningEl.classList.remove("hidden");
      return;
    }

    const task = {
      id: Date.now().toString(),
      text: trimmed,
      done: false,
      createdAt: Date.now(),
    };

    this.tasks.push(task);
    this.saveTasks();
    this.renderAll();

    if (inputEl) inputEl.value = "";
    if (warningEl) warningEl.classList.add("hidden");
  },

  // ---- task actions (6.4) ----

  /**
   * Flips the done state of the task with the given id.
   * @param {string} id
   */
  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    task.done = !task.done;
    this.saveTasks();
    this.renderAll();
  },

  /**
   * Updates the text of the task with the given id.
   * If newText is blank/whitespace-only, shows #todo-empty-warning and returns without saving.
   * @param {string} id
   * @param {string} newText
   */
  editTask(id, newText) {
    const trimmed = typeof newText === "string" ? newText.trim() : "";
    const warningEl = document.getElementById("todo-empty-warning");

    if (trimmed === "") {
      if (warningEl) warningEl.classList.remove("hidden");
      return;
    }

    if (warningEl) warningEl.classList.add("hidden");

    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    task.text = trimmed;
    this.saveTasks();
    this.renderAll();
  },

  /**
   * Removes the task with the given id from the list.
   * @param {string} id
   */
  deleteTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.saveTasks();
    this.renderAll();
  },

  /**
   * Enters inline edit mode for the given <li> element.
   * Replaces the task text <span> with an <input> and a confirm button.
   * Does NOT call renderAll() — only manipulates the specific <li>.
   * @param {string} id
   * @param {HTMLLIElement} li
   */
  _enterEditMode(id, li) {
    const span = li.querySelector("span");
    if (!span) return;

    const currentText = span.textContent;

    // Build inline input
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.className =
      "flex-1 rounded-lg px-2 py-1 text-sm bg-white/70 dark:bg-white/20 border border-current outline-none";
    input.setAttribute("aria-label", "Edit teks tugas");

    // Confirm button
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "💾";
    confirmBtn.className =
      "min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg font-semibold";
    confirmBtn.setAttribute("aria-label", "Simpan perubahan");
    confirmBtn.dataset.action = "confirm-edit";
    confirmBtn.dataset.id = id;

    const handleConfirm = () => {
      const value = input.value;
      if (value.trim() === "") {
        // Show warning but keep the input open
        const warningEl = document.getElementById("todo-empty-warning");
        if (warningEl) warningEl.classList.remove("hidden");
        input.focus();
        return;
      }
      this.editTask(id, value);
    };

    confirmBtn.addEventListener("click", handleConfirm);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleConfirm();
      if (e.key === "Escape") this.renderAll(); // cancel edit
    });

    // Replace span with input + confirm button (insert before edit button)
    const editBtn = li.querySelector('[data-action="edit"]');
    li.replaceChild(input, span);
    li.insertBefore(confirmBtn, editBtn);

    // Hide the original edit button while in edit mode
    if (editBtn) editBtn.style.display = "none";

    input.focus();
    input.select();
  },

  /**
   * Attaches:
   *   - A delegated click listener on #todo-list (toggle / edit / delete).
   *   - A click listener on #todo-add-btn.
   *   - A keydown listener on #todo-input (Enter key).
   * Called once from init().
   */
  _bindEvents() {
    const list = document.getElementById("todo-list");
    const inputEl = document.getElementById("todo-input");
    const addBtn = document.getElementById("todo-add-btn");

    if (list) {
      list.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === "toggle") {
          this.toggleTask(id);
        } else if (action === "edit") {
          // Enter inline edit mode — do NOT call editTask directly
          const li = btn.closest("li");
          if (li) this._enterEditMode(id, li);
        } else if (action === "delete") {
          this.deleteTask(id);
        }
        // 'confirm-edit' is handled by its own listener inside _enterEditMode
      });
    }

    if (addBtn && inputEl) {
      addBtn.addEventListener("click", () => this.addTask(inputEl.value));
      inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.addTask(inputEl.value);
      });
    }
  },

  init() {
    this.tasks = this.loadTasks();
    this._bindEvents();
    this.renderAll();
  },
};

// ============================================================
// LinksModule — Quick Links (Tasks 7.1–7.4)
// ============================================================

const LinksModule = {
  // ---- state ----
  links: [],

  // ---- helpers ----

  /**
   * Generates a unique ID for a link.
   * Uses crypto.randomUUID() when available; falls back to a timestamp + random string.
   * @returns {string}
   */
  _generateId() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  },

  // ---- persistence ----

  /**
   * Reads the link list from localStorage.
   * Falls back to [] if the stored value is missing, cannot be parsed, or is not an array.
   * @returns {Array}
   */
  loadLinks() {
    const raw = safeGet("tl_links", "[]");
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  /**
   * Persists the current link list to localStorage.
   */
  saveLinks() {
    safeSet("tl_links", JSON.stringify(this.links));
  },

  // ---- rendering ----

  /**
   * Creates and returns a card `<div>` representing a single link.
   * The element contains:
   *   - An <a> with href, target="_blank", rel="noopener noreferrer", and the link name as text
   *   - A delete button [data-action="delete"][data-id="{link.id}"]
   * @param {{ id: string, name: string, url: string }} link
   * @returns {HTMLDivElement}
   */
  renderLink(link) {
    const card = document.createElement("div");
    card.className =
      "flex items-center justify-between gap-2 p-3 rounded-lg bg-white/30 border border-color-bg-dark dark:bg-white/10";

    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.name;
    anchor.className = "flex-1 truncate font-semibold";

    const deleteBtn = document.createElement("button");
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.id = link.id;
    deleteBtn.className =
      "min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg font-semibold";
    deleteBtn.setAttribute("aria-label", "Hapus pintasan");
    deleteBtn.textContent = "X";

    card.appendChild(anchor);
    card.appendChild(deleteBtn);

    return card;
  },

  /**
   * Clears #link-list and re-renders every link in this.links.
   */
  renderAll() {
    const list = document.getElementById("link-list");
    if (!list) return;

    list.innerHTML = "";
    this.links.forEach((link) => {
      list.appendChild(this.renderLink(link));
    });
  },

  // ---- public API ----

  /**
   * Ensures the URL has an http/https prefix.
   * If the url does not start with "http://" or "https://", prepends "https://".
   * Otherwise returns the url unchanged.
   * @param {string} url
   * @returns {string}
   */
  normalizeUrl(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  },

  /**
   * Validates name and url, then adds a new link to the list.
   * - Trims both inputs; shows #link-warning and returns early if either is blank.
   * - Normalizes url via normalizeUrl(), then validates with the URL constructor.
   * - Only http: and https: protocols are accepted; anything else shows #link-warning and returns.
   * - On success: creates { id, name, url }, persists, re-renders, clears inputs, hides warning.
   * @param {string} name
   * @param {string} url
   */
  addLink(name, url) {
    const warningEl = document.getElementById("link-warning");
    const nameInputEl = document.getElementById("link-name-input");
    const urlInputEl = document.getElementById("link-url-input");

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedUrl = typeof url === "string" ? url.trim() : "";

    if (trimmedName === "" || trimmedUrl === "") {
      if (warningEl) warningEl.classList.remove("hidden");
      return;
    }

    const normalized = this.normalizeUrl(trimmedUrl);

    // Validate structure and protocol with the URL constructor
    let parsed;
    try {
      parsed = new URL(normalized);
    } catch {
      if (warningEl) warningEl.classList.remove("hidden");
      return;
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      if (warningEl) warningEl.classList.remove("hidden");
      return;
    }

    const link = {
      id: this._generateId(),
      name: trimmedName,
      url: normalized,
    };

    this.links.push(link);
    this.saveLinks();
    this.renderAll();

    if (nameInputEl) nameInputEl.value = "";
    if (urlInputEl) urlInputEl.value = "";
    if (warningEl) warningEl.classList.add("hidden");
  },

  /**
   * Removes the link with the given id from the list.
   * @param {string} id
   */
  deleteLink(id) {
    this.links = this.links.filter((l) => l.id !== id);
    this.saveLinks();
    this.renderAll();
  },

  /**
   * Wires up:
   *   - A click listener on #link-add-btn to add new links.
   *   - A delegated click listener on #link-list to handle delete actions.
   * Called once from init() before renderAll().
   */
  _bindEvents() {
    const addBtn = document.getElementById("link-add-btn");
    const nameInputEl = document.getElementById("link-name-input");
    const urlInputEl = document.getElementById("link-url-input");
    const list = document.getElementById("link-list");

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const name = nameInputEl ? nameInputEl.value : "";
        const url = urlInputEl ? urlInputEl.value : "";
        this.addLink(name, url);
      });
    }

    if (list) {
      list.addEventListener("click", (e) => {
        const btn = e.target.closest('[data-action="delete"]');
        if (!btn) return;
        this.deleteLink(btn.dataset.id);
      });
    }
  },

  init() {
    this.links = this.loadLinks();
    this._bindEvents();
    this.renderAll();
  },
};

// ============================================================
// ThemeModule — Dark / Light Theme (Tasks 8.1–8.7)
// ============================================================

const ThemeModule = {
  /**
   * Reads the saved theme from localStorage.
   * Returns "dark" or "light"; defaults to "light" for any missing or invalid value.
   * @returns {"dark"|"light"}
   */
  loadTheme() {
    const val = safeGet("tl_theme", "light");
    return val === "dark" ? "dark" : "light";
  },

  /**
   * Persists the given theme to localStorage.
   * @param {"dark"|"light"} theme
   */
  saveTheme(theme) {
    safeSet("tl_theme", theme);
  },

  /**
   * Applies the theme to the document and updates the toggle button label.
   * - "dark"  → adds class "dark" to <html>; sets button text to "☀️ Light"
   * - "light" → removes class "dark" from <html>; sets button text to "🌙 Dark"
   * @param {"dark"|"light"} theme
   */
  apply(theme) {
    const html = document.documentElement;
    const btn = document.getElementById("theme-toggle-btn");

    if (theme === "dark") {
      html.classList.add("dark");
      if (btn) btn.textContent = "☀️ Light";
    } else {
      html.classList.remove("dark");
      if (btn) btn.textContent = "🌙 Dark";
    }
  },

  /**
   * Flips the current theme between "light" and "dark",
   * then persists and applies the new value.
   */
  toggle() {
    const current = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    const next = current === "dark" ? "light" : "dark";
    this.saveTheme(next);
    this.apply(next);
  },

  /**
   * Loads the persisted theme, applies it immediately (prevents flash),
   * and wires up the toggle button.
   */
  init() {
    this.apply(this.loadTheme());

    const btn = document.getElementById("theme-toggle-btn");
    if (btn) btn.addEventListener("click", () => this.toggle());
  },
};

// ============================================================
// Bootstrap — initialise all modules after DOM is ready
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  ThemeModule.init(); // must be first — prevents flash of unstyled content
  GreetingModule.init();
  TimerModule.init();
  TodoModule.init();
  LinksModule.init();
});
