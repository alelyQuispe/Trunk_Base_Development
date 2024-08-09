# Trunk Based Development (TBD)
---------------------------------

## 🚀 ¿Qué es Trunk Based Development?
Trunk Based Development (TBD) es una metodología de desarrollo ágil que promueve la integración continua de código en una única rama principal, conocida como "trunk" (o main). Esta estrategia minimiza los conflictos de fusión y asegura que el código esté siempre en un estado listo para ser desplegado. TBD favorece la colaboración y la entrega continua al reducir el ciclo de vida de las ramas y permitir cambios pequeños y frecuentes.

## 🌿 Estructura de Ramas
La estructura de ramas sigue los principios de TBD para mantener el código limpio y bien integrado:

* **main:** Rama principal que contiene el código listo para producción.
* **feature/:** Ramas para desarrollar nuevas funcionalidades.
* **bugfix/:** Ramas para corrección de errores.
* **hotfix/:** Ramas para arreglos urgentes en producción.

Las ramas se fusionan rápidamente en main tras las pruebas y revisiones de código.

# ✅ Buenas Prácticas

## ✏️ Commits
* **Frecuencia y Tamaño:** Realiza commits pequeños y frecuentes.
* **Mensajes de Commit:** Usa mensajes claros y descriptivos que expliquen el propósito del cambio.
## 🔍 Revisión de Código
* **Revisiones Tempranas y Frecuentes:** Las revisiones de código deben ser rápidas para no retrasar el proceso de integración.
* **Revisión por Pares:** Cada cambio debe ser revisado por al menos otro miembro del equipo antes de ser fusionado en main.
## 🧪 Pruebas
* **Automatización de Pruebas:** Configura y mantén un conjunto robusto de pruebas automatizadas que se ejecuten en cada commit.
* **Pruebas en main:** Las pruebas deben ser lo suficientemente exhaustivas para detectar errores antes de que lleguen a producción.
  
## Imagen de flujo de referencia
![image](https://github.com/user-attachments/assets/cf7e44c9-39ed-4bd3-84f6-5cda616a092b)
