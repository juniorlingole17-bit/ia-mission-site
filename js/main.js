        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Formulaire : ouvre WhatsApp avec un message prérempli (aucun backend, aucun paiement)
  const form = $('#contactForm');
  if (form) {
    const status = $('#formStatus');
    const nameInput = form.elements['name'];
    const nameError = $('.error[data-for="name"]', form);

    const validateName = () => {
      const ok = nameInput.value.trim().length >= 2;
      nameInput.closest('.field').classList.toggle('invalid', !ok);
      nameInput.setAttribute('aria-invalid', String(!ok));
      nameError.textContent = ok ? '' : 'Merci d\'indiquer votre nom.';
      return ok;
    };

    nameInput.addEventListener('blur', validateName);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.className = 'form-status';

      if (!validateName()) {
        status.textContent = 'Indiquez votre nom pour continuer.';
        status.classList.add('ko');
        nameInput.focus();
        return;
      }

      const name = nameInput.value.trim();
      const service = form.elements['service'].value || 'la formation complète (20 000 FC)';
      const message = form.elements['message'].value.trim();

      let text = `Bonjour IA MISSION, je m'appelle ${name}. Je souhaite des informations sur : ${service}.`;
      if (message) text += ` ${message}`;

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      const win = window.open(url, '_blank');
      if (win) {
        try { win.opener = null; } catch (err) { /* ignore */ }
      } else {
        window.location.href = url;
      }

      status.textContent = 'WhatsApp s\'ouvre avec votre message prérempli. Il suffit de l\'envoyer.';
      status.classList.add('ok');
      form.reset();
    });
  }
})();
