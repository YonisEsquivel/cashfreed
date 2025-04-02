---
layout: layouts/home.njk
title: "Equipo de Yonis Esquivel"
---

<div class="hero">
  <h1>Maximiza tus Ganancias con CashFreed</h1>
  <p>Curso y estrategias para que nuestro equipo aproveche al máximo el potencial de CashFreed y ganemos dinero a lo grande.</p>
  {# Añadir botón para ir al curso #}
  {% if collections.lessons.length > 0 %}
    {% set firstLesson = collections.lessons[0] %}
    <a href="{{ firstLesson.url | url }}" class="hero-button">
      Comienza tu aprendizaje →
    </a>
  {% endif %}
</div>

<h2 class="section-title">Contenido del curso</h2>

<div class="modules-grid">
  {# Iterar sobre la colección de módulos ordenada #}
  {% for module in collections.modules %}
  <div class="module-card">
    {# Usar el título del module.json #}
    <h3>{{ module.data.title }}</h3>
    {# Listar las lecciones de este módulo #}
    <ul>
      {% set moduleLessons = [] %} {# Crear array para lecciones del módulo #}
      {% for lesson in collections.lessons %}
        {% set normalizedLessonPath = lesson.inputPath.replace('./', '') %}
        {% if normalizedLessonPath.startsWith(module.dir) %}
           {# Añadir la lección al array si pertenece al módulo #}
           {% set moduleLessons = (moduleLessons.push(lesson), moduleLessons) %}
        {% endif %}
      {% endfor %}

      {# Ahora iterar sobre las lecciones filtradas para este módulo #}
      {% if moduleLessons | length > 0 %}
        {% for lesson in moduleLessons %}
          <li>
            {{ lesson.data.title }} {# Mostrar solo el título #}
          </li>
        {% endfor %}
      {% else %}
        <li>(Próximamente)</li> {# Mensaje si no hay lecciones #}
      {% endif %}
    </ul>
  </div>
  {% endfor %}
</div>

<div class="button-container">
  {% if collections.lessons.length > 0 %}
    {% set firstLesson = collections.lessons[0] %}
    <a href="{{ firstLesson.url | url }}" class="button-start">
      <strong>¡Empezar el Curso! →</strong>
    </a>
  {% else %}
    <p><em>(Próximamente: Contenido del curso en preparación)</em></p>
  {% endif %}
</div>

<button id="backToTop" class="back-to-top" onclick="scrollToTop()">↑</button>

<script>
  // Mostrar el botón cuando se hace scroll hacia abajo
  window.onscroll = function() {
    const backToTopButton = document.getElementById("backToTop");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  };

  // Función para volver al inicio
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>