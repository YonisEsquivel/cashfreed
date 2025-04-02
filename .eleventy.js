const fs = require('node:fs');
const path = require('node:path');

module.exports = function(eleventyConfig) {

  // --- Shortcodes ---
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // --- Colecciones ---

  // Colección de Módulos (Método con fs) - Definición ÚNICA y FUNCIONAL
  eleventyConfig.addCollection("modules", function(collectionApi) {
    const modules = [];
    // Define el directorio base relativo a la raíz del proyecto para operaciones de fs
    const cursoDir = path.join('src', 'curso');
    console.log(`\n--- [FS Modules Collection] Iniciando en directorio: ${cursoDir} ---`);

    try {
      // Lee los nombres de las carpetas dentro de 'src/curso'
      const moduleFolders = fs.readdirSync(cursoDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      console.log(`[FS Modules Collection] Encontradas ${moduleFolders.length} carpetas de módulo:`, moduleFolders);

      for (const folderName of moduleFolders) {
        // Ruta completa para operaciones de fs
        const moduleFolderPath = path.join(cursoDir, folderName);
        // Ruta al archivo module.json (asumiendo que los archivos se llaman así)
        const moduleJsonPath = path.join(moduleFolderPath, 'module.json');

        console.log(` -> Procesando carpeta: ${folderName}`);

        // Verifica si module.json existe
        if (fs.existsSync(moduleJsonPath)) {
          console.log(`    - Encontrado: ${moduleJsonPath}`);
          try {
            // Lee y parsea el contenido de module.json
            const moduleDataContent = fs.readFileSync(moduleJsonPath, 'utf8');
            const moduleData = JSON.parse(moduleDataContent);
            console.log(`    - Datos leídos:`, moduleData);

            // Ruta relativa a 'src/' usada para comparación en plantillas e IDs
            const relativeModuleFolderPath = path.join('curso', folderName);

            // Construye el objeto del módulo
            modules.push({
              data: moduleData, // Datos del JSON parseado
              // 'dir' debe representar el directorio que contiene las lecciones, incluyendo src/, para la comparación en plantillas
              dir: path.join('src', relativeModuleFolderPath, '/').replace(/\\/g, '/'), // Normaliza slashes
              // 'inputPath' para el módulo en sí (la ruta del archivo json)
              inputPath: path.join('src', relativeModuleFolderPath, 'module.json').replace(/\\/g, '/'), // Normaliza slashes
              // Ya no buscamos lecciones aquí, eso sucede en la plantilla
            });

          } catch (parseError) {
            console.error(`>> ERROR al leer o parsear ${moduleJsonPath}:`, parseError);
          }
        } else {
          // Advertencia si no se encuentra module.json donde se espera
          console.warn(`>> ADVERTENCIA: No se encontró ${moduleJsonPath} en ${moduleFolderPath}`);
        }
      }

      // Ordena los módulos al final según 'order' o 'inputPath'
      modules.sort((a, b) => {
        // Usamos optional chaining (?.) por seguridad si 'data' fuera undefined
        const orderA = a.data?.order !== undefined ? a.data.order : a.inputPath;
        const orderB = b.data?.order !== undefined ? b.data.order : b.inputPath;
        if (orderA < orderB) return -1; if (orderA > orderB) return 1; return 0;
      });

    } catch (readDirError) {
      console.error(`>> ERROR al leer el directorio ${cursoDir}:`, readDirError);
    }

    console.log(`[FS Modules Collection] Final (longitud: ${modules.length})`);
    console.log("--- [FS Modules Collection] Finalizado ---");
    return modules;
  });

  // Colección de Lecciones (Método automático usando getFilteredByGlob())
  eleventyConfig.addCollection("lessons", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/curso/**/*.md").sort((a, b) => {
        // Asegurarse de que ambos tengan data.order antes de restar
        const orderA = a.data && a.data.order !== undefined ? a.data.order : Infinity;
        const orderB = b.data && b.data.order !== undefined ? b.data.order : Infinity;
        return orderA - orderB;
    });
  });

  // --- Copia de Assets Estáticos ---
  eleventyConfig.addPassthroughCopy("src/assets");

  // --- Configuración Principal ---
  return {
    // Define los directorios de entrada, salida, includes y datos
    dir: {
      input: "src",
      includes: "_includes", // Relativo a input
      data: "_data",         // Relativo a input
      output: "_site"        // Directorio de salida (relativo a la raíz del proyecto)
    },
    // Define los motores de plantilla por defecto
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // Asegúrate de que dataTemplateEngine NO esté activo o esté comentado
    // dataTemplateEngine: "njk",
  };
};