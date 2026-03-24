const Course = require('./models/course');
const sequelize = require('./config/db');

const cargarDatosReales = async () => {
    try {
        await sequelize.authenticate();
        // sync({alter: true}) asegura que las nuevas columnas existan
        await sequelize.sync({ alter: true });

        const cursos = [
            { 
                titulo: "Word desde Cero", 
                instructor: "Leonel Martínez", 
                nivel: "Principiante", 
                lecciones: 10, 
                ruta_assets: "/assets/cursos/word",
                descripcion: "Domina la creación de documentos profesionales."
            },
            { 
                titulo: "Excel y Análisis de Datos", 
                instructor: "Susana Morales", 
                nivel: "Avanzado", 
                lecciones: 12, 
                ruta_assets: "/assets/cursos/excel",
                descripcion: "Aprende fórmulas, tablas dinámicas y gráficos."
            },
            { 
                titulo: "PowerPoint Profesional", 
                instructor: "Susana Morales", 
                nivel: "Principiante", 
                lecciones: 8, 
                ruta_assets: "/assets/cursos/powerpoint",
                descripcion: "Crea presentaciones de alto impacto."
            },
            { 
                titulo: "Administración y Finanzas", 
                instructor: "Leonel Martínez", 
                nivel: "Principiante", 
                lecciones: 15, 
                ruta_assets: "/assets/cursos/administracion",
                descripcion: "Fundamentos para la gestión de proyectos."
            }
        ];

        await Course.bulkCreate(cursos);
        console.log("✅ ¡Cursos reales cargados en Railway con éxito!");
        process.exit();
    } catch (error) {
        console.error("❌ Error cargando cursos:", error);
        process.exit(1);
    }
};

cargarDatosReales();