export const cursoContenido = {
  "1": { 
    titulo: "Word para Principiantes",
    instructor: "Leonel Martinez",
    modulos: Array.from({ length: 20 }, (_, i) => ({
      num: i + 1,
      tema: `Módulo ${i + 1}`,
      // CAMBIAMOS .png por .PNG
      img: `/assets/cursos/word/Diapositiva${i + 1}.PNG` 
    }))
  },
  "2": { 
    titulo: "Excel para Principiantes",
    instructor: "Leonel Martinez",
    modulos: Array.from({ length: 20 }, (_, i) => ({
      num: i + 1,
      tema: `Módulo ${i + 1}`,
      img: `/assets/cursos/excel/Diapositiva${i + 1}.PNG`
    }))
  },
  "3": { 
    titulo: "PowerPoint para Principiantes",
    instructor: "Susana Morales",
    modulos: Array.from({ length: 20 }, (_, i) => ({
      num: i + 1,
      tema: `Módulo ${i + 1}`,
      img: `/assets/cursos/powerpoint/Diapositiva${i + 1}.PNG`
    }))
  },
  "4": { 
    titulo: "Administración y Finanzas",
    instructor: "Susana Morales",
    modulos: Array.from({ length: 17 }, (_, i) => ({
      num: i + 1,
      tema: `Módulo ${i + 1}`,
      img: `/assets/cursos/administracion/Diapositiva${i + 1}.PNG`
    }))
  }
};