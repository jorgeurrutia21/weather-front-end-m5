# Weather Front-end M5

## Este proyecto corresponde a una plataforma web orientada a mostrar el estado del tiempo en distintas ciudades de Chile, presentando la información de manera clara, ordenada y accesible para el usuario , la informacion climatica se obtiene mediante una API.

## Ciudades incluidas

Se seleccionaron 10 ciudades representativas de Chile (norte, centro y sur) pasando desde Antofagasta hasta Punta Arenas con el objetivo de
mostrar la diversidad de climas a lo largo del territorio , toda la informacion se obtiene de la API Open-Meteo(https://open-meteo.com/) que nos proporciona el estado del clima en tiempo real.

---

## Los datos estan organizados de la siguiente manera:

estan definidos en JavaScript en un arreglo llamado "lugares".

Cada lugar es un objeto que contiene:

- id
- nombre
- imagen
- lat
- long

## Estadísticas que calcula la app

En la vista de detalle, la aplicación calcula automáticamente:

- Temperatura mínima de la semana
- Temperatura máxima de la semana
- Temperatura promedio
- Cantidad de días soleados, nublados y lluviosos
- Alertas Climaticas

---

## Tecnologías utilizadas

- HTML
- CSS
- JavaScript(ES6+)
- SASS
- API Open-Meteo

---

## Estructura de clases

# Clase `ApiClima`

Esta clase se encarga de toda la lógica relacionada con la API del clima.

## Responsabilidades:

- Construir la URL de la API.
- Obtener los datos climáticos mediante `fetch`.
- Manejar errores de conexión.
- Transformar la respuesta JSON.
- Convertir códigos climáticos numéricos en texto legible.
- Clasificar niveles UV.

## Métodos principales

# `obtenerClima(lat, lon)`

Obtiene los datos climáticos desde la API utilizando coordenadas geográficas.

# `transformarDatos(data)`

Transforma la respuesta JSON en un formato más fácil de utilizar dentro de la aplicación.

# `obtenerEstadoClima(code)`

Convierte códigos climáticos de la API en estados como:

- Soleado
- Nublado
- Lluvioso
- Nevado

# `obtenerNivelUV(uv)`

Clasifica el índice UV en:

- Bajo
- Moderado
- Alto
- Muy Alto
- Extremo

---

## Funciones principales

# `renderCards()`

Renderiza dinámicamente las cards de ciudades en la vista Home.

# `renderDetalle(id)`

Genera la vista de detalle de una ciudad mostrando:

- Pronóstico semanal
- Estadísticas
- Alertas climáticas

# `calcularEstadisticas(pronostico)`

Calcula:

- Temperatura mínima
- Temperatura máxima
- Temperatura promedio
- Cantidad de días soleados y lluviosos

# `generarAlertas(stats)`

Genera alertas climáticas según reglas simples:

- Si el promedio semanal supera los 30°C:
    - `"Alerta de calor extremo"`

- Si existen 3 o más días lluviosos:
    - `"Semana muy lluviosa"`

- Si la temperatura mínima es menor a 0°C:
    - `"Posibles heladas esta semana"`

---

# Programación asíncrona

La aplicación utiliza:

- `fetch()`
- `Promises`
- `async/await`

para obtener datos desde la API Open-Meteo.

## Características principales

- Visualización del estado del tiempo en diez ciudades de Chile
- Consulta detallada del clima actual al seleccionar una ciudad
- Pronóstico meteorológico para los próximos 7 días
- Uso de clases , fetch para comunicacion con la API y Async/Await

---

## Ejecución del proyecto

Para ejecutar este proyecto de manera local:

1. Clonar o descargar el repositorio:  
   https://github.com/jorgeurrutia21/weather-front-end-m5
2. Abrir la carpeta del proyecto

3. Ejecutar el archivo index.html en un navegador web  
   (Recomendado: Google Chrome)

---

## Objetivo del proyecto

El objetivo principal es entregar información meteorológica de distintas ciudades de Chile, permitiendo al usuario consultar tanto el clima actual como el pronóstico estimado para los próximos 7 días de diferentes ciudades de Chile.

---

## Autor

_Jorge Urrutia_
