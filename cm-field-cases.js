(function () {
  'use strict';

  document.querySelectorAll('.cm-field').forEach(field => {
    const points = [...field.querySelectorAll('[data-point]')];
    const notes = [...field.querySelectorAll('[data-point-note]')];
    const directions = [...field.querySelectorAll('[data-point-choice]')];

    function selectPoint(index) {
      points.forEach((point, i) => {
        point.setAttribute('aria-pressed', String(index === i));
      });
      directions.forEach((button, i) => {
        button.setAttribute('aria-pressed', String(index === i));
      });
      notes.forEach((note, i) => {
        note.hidden = index !== i;
      });
    }

    points.forEach((point, i) => point.addEventListener('click', () => selectPoint(i)));
    directions.forEach((button, i) => button.addEventListener('click', () => selectPoint(i)));
    selectPoint(0);
    field.classList.add('cm-field-ready');
  });

  document.querySelectorAll('.cm-field-case').forEach(example => {
    const buttons = [...example.querySelectorAll('[data-case-choice]')];
    const result = example.querySelector('[data-case-result]');
    const guidance = example.querySelector('details');
    example.classList.add('cm-case-ready');
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        buttons.forEach((choice, i) => {
          choice.setAttribute('aria-pressed', String(index === i));
        });
        const correct = String(index) === example.dataset.answer;
        result.textContent = correct ? 'この場面で先に確かめたい対応です。' : 'この場面では、もう一方の対応を先に検討します。';
        result.dataset.correct = String(correct);
        guidance.open = true;
      });
    });
  });
})();
