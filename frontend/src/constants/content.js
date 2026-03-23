export const cursoContenido = {
  "1": { 
    titulo: "Word para Principiantes",
    instructor: "Leonel Martinez",
    // Creamos 10 módulos (20 diapositivas / 2)
    modulos: Array.from({ length: 10 }, (_, i) => ({
      num: i + 1,
      tema: `Módulo ${i + 1}`,
      imgs: [
        `/assets/cursos/word/Diapositiva${(i * 2) + 1}.PNG`,
        `/assets/cursos/word/Diapositiva${(i * 2) + 2}.PNG`
      ]
    }))
  },
  "2": { 
    titulo: "Excel para Principiantes",
    instructor: "Leonel Martinez",
    modulos: Array.from({ length: 10 }, (_, i) => ({
      num: i + 1,
      tema: `Módulo ${i + 1}`,
      imgs: [
        `/assets/cursos/excel/Diapositiva${(i * 2) + 1}.PNG`,
        `/assets/cursos/excel/Diapositiva${(i * 2) + 2}.PNG`
      ]
    }))
  },
  "3": { 
    titulo: "PowerPoint para Principiantes",
    instructor: "Susana Morales",
    modulos: Array.from({ length: 10 }, (_, i) => ({
      num: i + 1,
      tema: `Módulo ${i + 1}`,
      imgs: [
        `/assets/cursos/powerpoint/Diapositiva${(i * 2) + 1}.PNG`,
        `/assets/cursos/powerpoint/Diapositiva${(i * 2) + 2}.PNG`
      ]
    }))
  },
  "4": { 
    titulo: "Administración y Finanzas",
    instructor: "Susana Morales",
    // 17 diapositivas = 8 módulos de dos y 1 módulo final de una
    modulos: Array.from({ length: 9 }, (_, i) => {
      const firstImg = (i * 2) + 1;
      const secondImg = (i * 2) + 2;
      return {
        num: i + 1,
        tema: `Módulo ${i + 1}`,
        imgs: secondImg <= 17 
          ? [`/assets/cursos/administracion/Diapositiva${firstImg}.PNG`, `/assets/cursos/administracion/Diapositiva${secondImg}.PNG`]
          : [`/assets/cursos/administracion/Diapositiva${firstImg}.PNG`]
      };
    })
  }
};