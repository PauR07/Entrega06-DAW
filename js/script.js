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
    formulario.reset()
    cajaId.value = ""
    error.textContent = ""
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

    for (let tarea of tareas) {
        const tarjeta = document.createElement("div")
        tarjeta.className = "tarea " + tarea.prioridad

        const titulo = document.createElement("h4")
        titulo.textContent = tarea.titulo

        const descripcion = document.createElement("p")
        descripcion.textContent = tarea.descripcion

        const prioridad = document.createElement("p")
        prioridad.textContent = "Prioridad: " + tarea.prioridad

        const fecha = document.createElement("p")
        fecha.textContent = "Fecha límite: " + tarea.fecha

        const selectEstado = document.createElement("select")
        selectEstado.value = tarea.estado

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

        selectEstado.addEventListener("change", function () {
            tarea.estado = selectEstado.value
            guardarTareas(tareas)
            pintarTareas()
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