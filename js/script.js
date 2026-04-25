const CLAVE_STORAGE = "tareasKanban"

let tareas = cargarTareas()

if (tareas.length === 0) {
    tareas = [
        {
            id: 1,
            titulo: "Hacer estructura HTML",
            descripcion: "Crear el formulario, filtros y columnas Kanban",
            prioridad: "media",
            fecha: "2026-05-01",
            estado: "porHacer",
            creadoEl: new Date().toLocaleDateString()
        },
        {
            id: 2,
            titulo: "Probar localStorage",
            descripcion: "Comprobar que las tareas se guardan al recargar",
            prioridad: "alta",
            fecha: "2026-05-02",
            estado: "enCurso",
            creadoEl: new Date().toLocaleDateString()
        }
    ]

    guardarTareas(tareas)
}

console.log(tareas)

function cargarTareas() {
    const datosGuardados = localStorage.getItem(CLAVE_STORAGE)

    if (datosGuardados === null) {
        return []
    }

    return JSON.parse(datosGuardados)
}

function guardarTareas(listaTareas) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(listaTareas))
}