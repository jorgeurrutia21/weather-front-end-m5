const lugares = [
    {
        id: 1,
        nombre: "Santiago",
        imagen: "assets/img/santiago5.jpg",
        lat: -33.45,
        lon: -70.66,
    },

    {
        id: 2,
        nombre: "Valparaiso",
        imagen: "assets/img/valparaiso4.jpg",
        lat: -33.04,
        lon: -71.62,
    },

    {
        id: 3,
        nombre: "Concepcion",
        imagen: "assets/img/concepcion2.jpg",
        lat: -36.82,
        lon: -73.05,
    },

    {
        id: 4,
        nombre: "La Serena",
        imagen: "assets/img/laserena2.jpg",
        lat: -29.9,
        lon: -71.25,
    },

    {
        id: 5,
        nombre: "Antofagasta",
        imagen: "assets/img/antofagasta2.jpg",
        lat: -23.65,
        lon: -70.4,
    },

    {
        id: 6,
        nombre: "Temuco",
        imagen: "assets/img/temuco3.jpg",
        lat: -38.74,
        lon: -72.6,
    },

    {
        id: 7,
        nombre: "Puerto Montt",
        imagen: "assets/img/puertomontt2.jpg",
        lat: -41.47,
        lon: -72.94,
    },

    {
        id: 8,
        nombre: "Punta Arenas",
        imagen: "assets/img/puntaarenas2.jpg",
        lat: -53.16,
        lon: -70.91,
    },

    {
        id: 9,
        nombre: "Iquique",
        imagen: "assets/img/iquique4.jpg",
        lat: -20.23,
        lon: -70.14,
    },

    {
        id: 10,
        nombre: "Rancagua",
        imagen: "assets/img/rancagua.jpg",
        lat: -34.17,
        lon: -70.74,
    },
];

class ApiClima {
    constructor(baseUrl) {
        this.baseUrl = baseUrl; //se guarda la url para usarla mas adelante
    }
    //revisa el tipo de clima en la api con numeros y los convierte en string como lluvioso etc.
    obtenerEstadoClima(code) {
        if (code === 0) return "Soleado";

        if ([1, 2, 3].includes(code)) {
            return "Nublado";
        }
        if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
            return "Lluvioso";
        }
        if ([71, 73, 75].includes(code)) {
            return "Nevado";
        }

        return "Variable";
    }
    //aqui los mismo pero con el nivel de uv ,busca los numeros y los convierte en bajo,medio,etc.
    obtenerNivelUV(uv) {
        if (uv <= 2) return "Bajo";
        if (uv <= 5) return "Moderado";
        if (uv <= 7) return "Alto";
        if (uv <= 10) return "Muy Alto";

        return "Extremo";
    }

    async obtenerClima(lat, lon) {
        try {
            const url =
                `${this.baseUrl}` +
                `?latitude=${lat}` +
                `&longitude=${lon}` +
                `&current=temperature_2m,relative_humidity_2m,weather_code,uv_index` +
                `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
                `&timezone=auto`;

            const response = await fetch(url); //con el fetch llamamos a la variable que tiene la api

            if (!response.ok) {
                throw new Error("Error al obtener datos");
            }

            const data = await response.json();

            return this.transformarDatos(data);
        } catch (error) {
            console.error("Error API:", error);

            return null;
        }
    }

    transformarDatos(data) {
        const actual = data.current;
        const daily = data.daily;
        //seconvierte la fecha de numeros a string del dia de la semana
        const pronosticoSemanal = daily.time.map((fecha, index) => ({
            dia: new Date(fecha).toLocaleDateString("es-CL", {
                weekday: "long",
            }),

            min: Math.round(daily.temperature_2m_min[index]),
            max: Math.round(daily.temperature_2m_max[index]),
            estado: this.obtenerEstadoClima(daily.weather_code[index]),
        }));

        return {
            estadoActual: this.obtenerEstadoClima(actual.weather_code),
            tempActual: Math.round(actual.temperature_2m),
            humedad: `${actual.relative_humidity_2m}%`,
            uv: this.obtenerNivelUV(actual.uv_index),

            pronosticoSemanal,
        };
    }
}

//funcion para buscar la ciudad con el id
function obtenerLugarPorId(id) {
    return lugares.find((lugar) => lugar.id === id) || null;
}

const crearElemento = (tag, texto = "", clase = "") => {
    const elemento = document.createElement(tag);

    elemento.textContent = texto;
    elemento.className = clase;

    return elemento;
};

//funcion para calcular el pronostico semanal y la estadistica
function calcularEstadisticas(pronostico) {
    let min = Infinity;
    let max = -Infinity;
    let suma = 0;

    const conteo = {
        Soleado: 0,
        Lluvioso: 0,
        Nublado: 0,
        Variable: 0,
    };

    for (const { min: tempMin, max: tempMax, estado } of pronostico) {
        if (tempMin < min) min = tempMin;
        if (tempMax > max) max = tempMax;

        suma += tempMin + tempMax;

        conteo[estado] ??= 0;
        conteo[estado]++;
    }

    const promedio = (suma / (pronostico.length * 2)).toFixed(1);

    return {
        min,
        max,
        promedio,
        conteo,
    };
}

//esta funcion crea y calcula las alertas
function generarAlertas(stats) {
    const alertas = [];

    if (stats.promedio > 30) {
        alertas.push("Alerta de calor extremo");
    }
    if (stats.conteo.Lluvioso >= 3) {
        alertas.push("Semana muy lluviosa");
    }
    if (stats.min < 0) {
        alertas.push("Posibles heladas esta semana");
    }
    if (alertas.length === 0) {
        alertas.push("Sin alertas climáticas");
    }

    return alertas;
}

//los id que llaman al html y la api para trabajarla como un objeto
const apiClient = new ApiClima("https://api.open-meteo.com/v1/forecast");
const container = document.querySelector("#city-container");
const detalleContainer = document.querySelector("#detalle-container");
const vistaHome = document.querySelector("#vista-home");
const vistaDetalle = document.querySelector("#vista-detalle");
const btnVolver = document.querySelector("#btn-volver");
const header = document.querySelector("header");
const buscador = document.querySelector("#buscador");
const form = document.querySelector("form");

//form para evitar que se recargue la pagina
form.addEventListener("submit", (e) => {
    e.preventDefault();
});

btnVolver.addEventListener("click", mostrarHome);
container.addEventListener("click", (e) => {
    const card = e.target.closest(".card");

    if (!card) return;

    const id = Number(card.dataset.id);

    mostrarDetalle(id);
});

//buscador con el id del html .trim elimina espacio al inicio y al final
buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();

    const filtrados = lugares.filter((lugar) =>
        lugar.nombre.toLowerCase().includes(texto),
    );

    renderCards(filtrados);
});

async function cargarClimaCiudades() {
    try {
        container.textContent = "Un momento cargando datos..."; //aqui se carga los datos de la ciudades con la y lon de la  api

        const promesas = lugares.map(async (lugar) => {
            const clima = await apiClient.obtenerClima(lugar.lat, lugar.lon);

            clima && Object.assign(lugar, clima);
        });

        await Promise.all(promesas);

        renderCards();
    } catch (error) {
        console.error(error);
        container.textContent = "Se ha producido un error al cargar los datos";
    }
}

//aqui la seccion de las card
function renderCards(lista = lugares) {
    container.textContent = "";

    lista.forEach((lugar) => {
        const col = crearElemento("div", "", "col-12 col-md-6 col-lg-4");

        const card = crearElemento("article", "", "card card--ciudad h-100");
        card.dataset.id = lugar.id;

        const img = document.createElement("img"); //imagen y posicionamiento de la info de card
        img.src = lugar.imagen;
        img.alt = lugar.nombre;
        img.classList.add("card__img");

        const info = crearElemento("div", "", "card__info");
        const izquierda = document.createElement("div");
        const derecha = document.createElement("div");

        izquierda.appendChild(crearElemento("h3", lugar.nombre));
        izquierda.appendChild(
            crearElemento("p", `${lugar.tempActual}°C - ${lugar.estadoActual}`),
        );

        derecha.appendChild(crearElemento("p", `Humedad: ${lugar.humedad}`));
        derecha.appendChild(crearElemento("p", `UV: ${lugar.uv}`));
        info.appendChild(izquierda);
        info.appendChild(derecha);

        card.appendChild(img);
        card.appendChild(info);
        col.appendChild(card);

        container.appendChild(col);
    });
}

//seccion de detalle
function renderDetalle(id) {
    const lugar = obtenerLugarPorId(id);
    if (!lugar) return;
    detalleContainer.textContent = "";
    const stats = calcularEstadisticas(lugar.pronosticoSemanal);
    const alertas = generarAlertas(stats);
    const row = document.createElement("div"); //contenedor imagen y texto de detalle
    row.className = "row";
    const colImg = document.createElement("div"); //imagen seccion detalle
    colImg.className = "col-12 col-md-6";

    const img = document.createElement("img");
    img.src = lugar.imagen;
    img.alt = lugar.nombre;
    img.classList.add("img-fluid", "detalle__img");
    colImg.appendChild(img);

    const colTexto = document.createElement("div"); //seccion temperatura actual y estado
    colTexto.className = "col-12 col-md-6";

    colTexto.appendChild(crearElemento("h2", lugar.nombre, "mb-4"));
    colTexto.appendChild(
        crearElemento("p", `Temperatura actual: ${lugar.tempActual}°C`),
    );
    colTexto.appendChild(crearElemento("p", `Estado: ${lugar.estadoActual}`));

    const estadisticasDiv = document.createElement("div"); //seccion de las estadisticas de la semana// estadisticasDiv.className = "mt-4";
    estadisticasDiv.appendChild(
        crearElemento("h4", "Estadísticas de la Semana"),
    );
    estadisticasDiv.appendChild(
        crearElemento("p", `Temperatura mínima: ${stats.min}°C`),
    );
    estadisticasDiv.appendChild(
        crearElemento("p", `Temperatura máxima: ${stats.max}°C`),
    );
    estadisticasDiv.appendChild(
        crearElemento("p", `Temperatura promedio: ${stats.promedio}°C`),
    );
    estadisticasDiv.appendChild(
        crearElemento("p", `Días soleados: ${stats.conteo.Soleado}`),
    );
    estadisticasDiv.appendChild(
        crearElemento("p", `Días lluviosos: ${stats.conteo.Lluvioso}`),
    );

    const contenidoDetalle = document.createElement("div"); //este es el div que contiene todo de detalle
    contenidoDetalle.className =
        "d-flex gap-5 align-items-start justify-content-between flex-wrap mt-4";

    const columnaIzquierda = document.createElement("div"); //seccion de la columna izquierda
    columnaIzquierda.className = "flex-fill";
    columnaIzquierda.appendChild(estadisticasDiv);

    const alertaDiv = document.createElement("div"); //la alerta de clima
    alertaDiv.className = "mt-4"; //seccion de alerta margen para despegarlo un poco de arriba
    alertaDiv.appendChild(crearElemento("h4", "Alertas Climáticas"));
    alertas.forEach((alerta) => {
        alertaDiv.appendChild(crearElemento("p", alerta));
    });
    columnaIzquierda.appendChild(alertaDiv);

    const columnaDerecha = document.createElement("div"); //seccion para ajustar la columna derecha de detalle
    columnaDerecha.className = "flex-fill";

    const pronosticoDiv = document.createElement("div");
    pronosticoDiv.appendChild(crearElemento("h4", "Pronóstico Semanal"));

    lugar.pronosticoSemanal.forEach((dia) => {
        pronosticoDiv.appendChild(
            crearElemento(
                "p",
                `${dia.dia}: ${dia.min}° / ${dia.max}°  ${dia.estado}`,
            ),
        );
    });

    columnaDerecha.appendChild(pronosticoDiv);
    contenidoDetalle.appendChild(columnaIzquierda);
    contenidoDetalle.appendChild(columnaDerecha);

    colTexto.appendChild(contenidoDetalle); //se le agrega el texto a las columnas de detalle

    row.appendChild(colImg);
    row.appendChild(colTexto);

    detalleContainer.appendChild(row);
}

//funcion para mostrar el home y detalle
function mostrarHome() {
    vistaHome.classList.remove("d-none");
    vistaDetalle.classList.add("d-none");
    header.classList.remove("d-none");
}

function mostrarDetalle(id) {
    renderDetalle(id);

    vistaHome.classList.add("d-none");
    vistaDetalle.classList.remove("d-none");
    header.classList.add("d-none");
}

cargarClimaCiudades();
