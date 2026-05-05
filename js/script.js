const CLAVE_STORAGE = "tareasKanban"

const formulario = document.getElementById("formulario")
const cajaId = document.getElementById("id")
const cajaTitulo = document.getElementById("titulo")
const cajaDescripcion = document.getElementById("descripcion")
const cajaPrioridad = document.getElementById("prioridad")
const cajaFecha = document.getElementById("fecha")
const error = document.getElementById("error")

const colPorHacer = document.getElementById("colPorHacer")
const colEnCurso = document.getElementById("colEnCurso")
const colHecho = document.getElementById("colHecho")

const filtroEstado = document.getElementById("filtroEstado")
const filtroPrioridad = document.getElementById("filtroPrioridad")
const busqueda = document.getElementById("busqueda")

const total = document.getElementById("total")
const porHacer = document.getElementById("porHacer")
const enCurso = document.getElementById("enCurso")
const hecho = document.getElementById("hecho")
const porcentaje = document.getElementById("porcentaje")

let tareas = cargarTareas()

if (tareas.length === 0) {
    tareas = [
        {
            id: 1,
            titulo: "Hacer estructura HTML",
            descripcion: "Crear formulario, filtros y columnas",
            prioridad: "media",
            fecha: "2026-05-01",
            estado: "porHacer",
            creadoEl: new Date().toLocaleDateString()
        },
        {
            id: 2,
            titulo: "Probar localStorage",
            descripcion: "Comprobar que se guardan las tareas",
            prioridad: "alta",
            fecha: "2026-05-02",
            estado: "enCurso",
            creadoEl: new Date().toLocaleDateString()
        }
    ]

    guardarTareas(tareas)
}

pintarTareas()
actualizarEstadisticas()

prepararDragAndDrop()

formulario.addEventListener("submit", function (e) {
    e.preventDefault()

    if (cajaTitulo.value.trim() === "") {
        error.textContent = "El título es obligatorio"
        return
    }

    if (cajaId.value === "") {
        crearTarea()
    } else {
        guardarCambios()
    }

    guardarTareas(tareas)
    pintarTareas()
    actualizarEstadisticas()

    formulario.reset()
    cajaId.value = ""
    error.textContent = ""
})

filtroEstado.addEventListener("change", function () {
    pintarTareas()
})

filtroPrioridad.addEventListener("change", function () {
    pintarTareas()
})

busqueda.addEventListener("input", function () {
    pintarTareas()
})

function crearTarea() {
    const nuevaTarea = {
        id: Date.now(),
        titulo: cajaTitulo.value.trim(),
        descripcion: cajaDescripcion.value.trim(),
        prioridad: cajaPrioridad.value,
        fecha: cajaFecha.value,
        estado: "porHacer",
        creadoEl: new Date().toLocaleDateString()
    }

    tareas.push(nuevaTarea)
}

function guardarCambios() {
    const id = Number(cajaId.value)

    for (let tarea of tareas) {
        if (tarea.id === id) {
            tarea.titulo = cajaTitulo.value.trim()
            tarea.descripcion = cajaDescripcion.value.trim()
            tarea.prioridad = cajaPrioridad.value
            tarea.fecha = cajaFecha.value
        }
    }
}

function pintarTareas() {
    colPorHacer.innerHTML = ""
    colEnCurso.innerHTML = ""
    colHecho.innerHTML = ""

    const tareasFiltradas = filtrarTareas()

    for (let tarea of tareasFiltradas) {
        const tarjeta = document.createElement("div")
        tarjeta.className = "tarea " + tarea.prioridad
        tarjeta.draggable = true

        tarjeta.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("id", tarea.id)
        })

        const titulo = document.createElement("h4")
        titulo.textContent = tarea.titulo

        const descripcion = document.createElement("p")
        descripcion.textContent = tarea.descripcion

        const prioridad = document.createElement("p")
        prioridad.textContent = "Prioridad: " + tarea.prioridad

        const fecha = document.createElement("p")
        fecha.textContent = "Fecha límite: " + tarea.fecha

        const selectEstado = document.createElement("select")

        const opcionPorHacer = document.createElement("option")
        opcionPorHacer.value = "porHacer"
        opcionPorHacer.textContent = "Por hacer"

        const opcionEnCurso = document.createElement("option")
        opcionEnCurso.value = "enCurso"
        opcionEnCurso.textContent = "En curso"

        const opcionHecho = document.createElement("option")
        opcionHecho.value = "hecho"
        opcionHecho.textContent = "Hecho"

        selectEstado.appendChild(opcionPorHacer)
        selectEstado.appendChild(opcionEnCurso)
        selectEstado.appendChild(opcionHecho)

        selectEstado.value = tarea.estado

        selectEstado.addEventListener("change", function () {
            tarea.estado = selectEstado.value
            guardarTareas(tareas)
            pintarTareas()
            actualizarEstadisticas()
        })

        const botonEditar = document.createElement("button")
        botonEditar.textContent = "Editar"

        botonEditar.addEventListener("click", function () {
            cajaId.value = tarea.id
            cajaTitulo.value = tarea.titulo
            cajaDescripcion.value = tarea.descripcion
            cajaPrioridad.value = tarea.prioridad
            cajaFecha.value = tarea.fecha
        })

        const botonEliminar = document.createElement("button")
        botonEliminar.textContent = "Eliminar"

        botonEliminar.addEventListener("click", function () {
            const confirmar = confirm("¿Seguro que quieres eliminar esta tarea?")

            if (confirmar) {
                tareas = tareas.filter(function (t) {
                    return t.id !== tarea.id
                })

                guardarTareas(tareas)
                pintarTareas()
                actualizarEstadisticas()
            }
        })

        tarjeta.appendChild(titulo)
        tarjeta.appendChild(descripcion)
        tarjeta.appendChild(prioridad)
        tarjeta.appendChild(fecha)
        tarjeta.appendChild(selectEstado)
        tarjeta.appendChild(botonEditar)
        tarjeta.appendChild(botonEliminar)

        if (tarea.estado === "porHacer") {
            colPorHacer.appendChild(tarjeta)
        } else if (tarea.estado === "enCurso") {
            colEnCurso.appendChild(tarjeta)
        } else if (tarea.estado === "hecho") {
            colHecho.appendChild(tarjeta)
        }
    }
}
function prepararDragAndDrop() {
    const columnas = document.querySelectorAll(".columna")

    for (let columna of columnas) {
        columna.addEventListener("dragover", function (e) {
            e.preventDefault()
        })

        columna.addEventListener("drop", function (e) {
            e.preventDefault()

            const id = Number(e.dataTransfer.getData("id"))
            const nuevoEstado = columna.dataset.estado

            for (let tarea of tareas) {
                if (tarea.id === id) {
                    tarea.estado = nuevoEstado
                }
            }

            guardarTareas(tareas)
            pintarTareas()
            actualizarEstadisticas()
        })
    }
}

function filtrarTareas() {
    const estadoSeleccionado = filtroEstado.value
    const prioridadSeleccionada = filtroPrioridad.value
    const textoBuscado = busqueda.value.toLowerCase()

    let resultado = []

    for (let tarea of tareas) {
        let cumpleEstado = estadoSeleccionado === "todos" || tarea.estado === estadoSeleccionado
        let cumplePrioridad = prioridadSeleccionada === "todas" || tarea.prioridad === prioridadSeleccionada

        let textoTarea = tarea.titulo.toLowerCase() + " " + tarea.descripcion.toLowerCase()
        let cumpleBusqueda = textoTarea.includes(textoBuscado)

        if (cumpleEstado && cumplePrioridad && cumpleBusqueda) {
            resultado.push(tarea)
        }
    }

    return resultado
}

function actualizarEstadisticas() {
    let totalTareas = tareas.length
    let totalPorHacer = 0
    let totalEnCurso = 0
    let totalHecho = 0

    for (let tarea of tareas) {
        if (tarea.estado === "porHacer") {
            totalPorHacer++
        } else if (tarea.estado === "enCurso") {
            totalEnCurso++
        } else if (tarea.estado === "hecho") {
            totalHecho++
        }
    }

    total.textContent = totalTareas
    porHacer.textContent = totalPorHacer
    enCurso.textContent = totalEnCurso
    hecho.textContent = totalHecho

    if (totalTareas === 0) {
        porcentaje.textContent = "0%"
    } else {
        porcentaje.textContent = Math.round((totalHecho / totalTareas) * 100) + "%"
    }
}

function cargarTareas() {
    const datos = localStorage.getItem(CLAVE_STORAGE)

    if (datos === null) {
        return []
    }

    return JSON.parse(datos)
}

function guardarTareas(listaTareas) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(listaTareas))
}