export const cursoContenido = {
  "1": { // ID para WORD
    titulo: "Word para Principiantes",
    instructor: "Leonel Martinez",
    modulos: Array.from({ length: 20 }, (_, i) => ({
      num: i + 1,
      tema: `Diapositiva ${i + 1}`,
      img: `/assets/cursos/word/Diapositiva${i + 1}.png`
    }))
  },
  "2": { // ID para EXCEL
    titulo: "Excel para Principiantes",
    instructor: "Leonel Martinez", // Siguiendo el estilo de los otros cursos
    modulos: Array.from({ length: 20 }, (_, i) => ({
      num: i + 1,
      tema: `Diapositiva ${i + 1}`,
      img: `/assets/cursos/excel/Diapositiva${i + 1}.png`
    }))
  },
  "3": { // ID para POWERPOINT
    titulo: "PowerPoint para Principiantes",
    instructor: "Susana Morales",
    modulos: Array.from({ length: 20 }, (_, i) => ({
      num: i + 1,
      tema: `Diapositiva ${i + 1}`,
      img: `/assets/cursos/powerpoint/Diapositiva${i + 1}.png`
    }))
  },
  "4": { // ID para ADMINISTRACIÓN
    titulo: "Administración y Finanzas",
    instructor: "Susana Morales",
    modulos: Array.from({ length: 17 }, (_, i) => ({ // Esta carpeta tiene 17 diapositivas
      num: i + 1,
      tema: `Diapositiva ${i + 1}`,
      img: `/assets/cursos/administracion/Diapositiva${i + 1}.png`
    }))
  }
};