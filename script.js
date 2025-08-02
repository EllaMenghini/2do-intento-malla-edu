document.addEventListener("DOMContentLoaded", () => {
  const subjects = Array.from(document.querySelectorAll(".subject"));
  const idToSubject = new Map();

  subjects.forEach(subject => {
    const id = subject.dataset.id;
    const prereq = subject.dataset.prereq.split(",").filter(p => p);
    idToSubject.set(id, {
      el: subject,
      id,
      prereq,
      approved: false
    });
  });

  function isAvailable(subject) {
    return subject.prereq.every(p => idToSubject.get(p)?.approved);
  }

  function updateStates() {
    idToSubject.forEach(subj => {
      const el = subj.el;
      if (subj.approved) {
        el.classList.add("approved");
        el.classList.remove("available", "blocked");
        el.querySelector(".toggle").textContent = "Aprobada";
      } else if (isAvailable(subj)) {
        el.classList.add("available");
        el.classList.remove("approved", "blocked");
        el.querySelector(".toggle").textContent = "Aprobar";
      } else {
        el.classList.add("blocked");
        el.classList.remove("available", "approved");
        el.querySelector(".toggle").textContent = "Bloqueada";
      }
    });
  }

  subjects.forEach(subject => {
    subject.addEventListener("click", () => {
      const id = subject.dataset.id;
      const subj = idToSubject.get(id);

      if (!isAvailable(subj) && !subj.approved) return; // no se puede marcar si está bloqueado

      subj.approved = !subj.approved; // toggle
      updateStates();
    });
  });

  updateStates(); // inicial
});
