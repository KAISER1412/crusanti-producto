(() => {
  "use strict";

  const WHATSAPP_NUMBER = "5210000000000";
  const calcularPrecioFinal = product => {
    if (!Number.isFinite(product.precioAnterior) || !Number.isFinite(product.descuento) || product.precioAnterior < 0 || product.descuento < 0 || product.descuento > 100) return null;
    return Math.round((product.precioAnterior * (1 - product.descuento / 100)) * 100) / 100;
  };
    const products = [
    {
      id: "grua-cr10",
      nombre: "Grúa Hidráulica Industrial CR-10",
      categoria: "Maquinaria industrial / grúas (demostración)",
      mainImage: "img/grua-cr10-1.jpg",
      gallery: ["img/grua-cr10-1.jpg", "img/grua-cr10-2.jpg", "img/grua-cr10-3.jpg", "img/grua-cr10-4.jpg"],
      descripcion: "La grúa hidráulica CR-10 está orientada a elevar y posicionar cargas en áreas industriales o de taller. Apoya maniobras de manejo de materiales de acuerdo con la configuración del espacio de trabajo.",
      caracteristicas: {
        "Tipo de equipo": "Grúa hidráulica para maniobras de elevación.",
        "Uso de catálogo": "Manejo y posicionamiento de cargas en entornos industriales o de taller.",
        "Sistema descrito": "Elevación hidráulica; configuración específica por confirmar.",
        "Datos por confirmar": "Capacidad, altura, alcance y controles."
      },
      precioAnterior: 185000,
      descuento: 15,
      stock: null,
      ofertaInicio: "2026-10-07T00:00:00",
      ofertaFin: "2026-10-07T23:59:59",
      isDemo: true,
      buyMessage: "Hola, me interesa la Grúa Hidráulica Industrial CR-10, modelo CR-10. Vi el producto en la página de demostración de Crusanti México y quisiera recibir información."
    },
    {
      id: "equipo-demo-02",
      nombre: "Equipo industrial DEMO-02",
      categoria: "Equipo industrial (demostración)",
      mainImage: "img/equipo-demo-02-1.jpg",
      gallery: ["img/equipo-demo-02-1.jpg", "img/equipo-demo-02-2.jpg", "img/equipo-demo-02-3.jpg", "img/equipo-demo-02-4.jpg"],
      descripcion: "Equipo industrial para apoyar operaciones generales en entornos productivos. La ficha no identifica una aplicación concreta ni incluye detalles técnicos adicionales.",
      caracteristicas: {
        "Registro": "Equipo industrial de demostración.",
        "Aplicación": "Uso industrial específico pendiente de identificar.",
        "Configuración": "Componentes y modo de operación por definir.",
        "Ficha real": "Datos técnicos pendientes de confirmación."
      },
      precioAnterior: 100000,
      descuento: 15,
      stock: null,
      ofertaInicio: "2026-10-07T00:00:00",
      ofertaFin: "2026-10-07T23:59:59",
      isDemo: true,
      buyMessage: "Hola, me interesa el producto de demostración Equipo industrial DEMO-02 de Crusanti México. Quisiera recibir información."
    },
    {
      id: "accesorio-demo-03",
      nombre: "Accesorio industrial DEMO-03",
      categoria: "Accesorios industriales (demostración)",
      mainImage: "img/accesorio-demo-03-1.jpg",
      gallery: ["img/accesorio-demo-03-1.jpg", "img/accesorio-demo-03-2.jpg", "img/accesorio-demo-03-3.jpg", "img/accesorio-demo-03-4.jpg"],
      descripcion: "Accesorio industrial presentado como complemento para equipos de trabajo. La ficha no detalla su función específica ni el equipo al que se integra.",
      caracteristicas: {
        "Registro": "Accesorio industrial de demostración.",
        "Función general": "Complemento industrial; propósito específico por confirmar.",
        "Compatibilidad": "Equipo o modelo de uso compatible por determinar.",
        "Contenido": "Materiales y piezas incluidos por confirmar."
      },
      precioAnterior: 6500,
      descuento: 15,
      stock: null,
      ofertaInicio: "2026-10-08T00:00:00",
      ofertaFin: "2026-10-08T23:59:59",
      isDemo: true,
      buyMessage: "Hola, me interesa el producto de demostración Accesorio industrial DEMO-03 de Crusanti México. Quisiera recibir información."
    },
    {
      "id": "grua-cr20",
      "nombre": "Grúa Hidráulica Industrial CR-20",
      "categoria": "Grúas",
      "descripcion": "La grúa hidráulica CR-20 apoya maniobras de elevación y colocación de cargas en operaciones industriales. Su uso se integra al manejo de materiales según las condiciones del área de trabajo.",
      "precioAnterior": 250000,
      "descuento": 15,
      "stock": 8,
      ofertaInicio: "2026-10-12T00:00:00",
      ofertaFin: "2026-10-12T23:59:59",
      "caracteristicas": {
        "Tipo de equipo": "Grúa hidráulica orientada al izaje industrial.",
        "Maniobra": "Apoyo para elevar y posicionar cargas.",
        "Contexto de uso": "Aplicaciones de taller o área industrial.",
        "Parámetros no publicados": "Capacidad, alcance, altura y configuración por confirmar."
      },
      "mainImage": "img/grua-cr20-1.jpg",
      "gallery": [
        "img/grua-cr20-1.jpg",
        "img/grua-cr20-2.jpg",
        "img/grua-cr20-3.jpg",
        "img/grua-cr20-4.jpg"
      ],
      "buyMessage": "Hola, me interesa el producto de ejemplo de catálogo Grúa Hidráulica Industrial CR-20. Quisiera confirmar sus especificaciones e inventario."
    },
    {
      "id": "montacargas-mt15",
      "nombre": "Montacargas Industrial MT-15",
      "categoria": "Maquinaria",
      "descripcion": "El montacargas MT-15 está pensado para trasladar y posicionar materiales en almacenes y áreas de operación. Sus horquillas apoyan el movimiento de cargas compatibles durante tareas de abastecimiento y organización.",
      "precioAnterior": 180000,
      "descuento": 12,
      "stock": 5,
      ofertaInicio: "2026-10-13T00:00:00",
      ofertaFin: "2026-10-13T23:59:59",
      "caracteristicas": {
        "Función principal": "Traslado y posicionamiento de cargas.",
        "Tipo de material": "Adecuado para cargas compatibles con la configuración de horquillas.",
        "Entorno de catálogo": "Operaciones de almacén o manejo interno.",
        "Parámetros por confirmar": "Capacidad, altura de elevación y dimensiones."
      },
      "mainImage": "img/montacargas-mt15-1.jpg",
      "gallery": [
        "img/montacargas-mt15-1.jpg",
        "img/montacargas-mt15-2.jpg",
        "img/montacargas-mt15-3.jpg",
        "img/montacargas-mt15-4.jpg"
      ],
      "buyMessage": "Hola, me interesa el producto de ejemplo de catálogo Montacargas Industrial MT-15. Quisiera confirmar sus especificaciones e inventario."
    },
    {
      "id": "plataforma-pe12",
      "nombre": "Plataforma Elevadora PE-12",
      "categoria": "Elevación",
      "descripcion": "La plataforma elevadora PE-12 facilita el acceso a zonas de trabajo en altura para tareas de instalación, mantenimiento o inspección. Su uso debe ajustarse a la configuración del equipo y a las condiciones del área.",
      "precioAnterior": 145000,
      "descuento": 18,
      "stock": 3,
      ofertaInicio: "2026-10-14T00:00:00",
      ofertaFin: "2026-10-14T23:59:59",
      "caracteristicas": {
        "Acceso de trabajo": "Acceso a zonas de trabajo elevadas; uso exacto por confirmar.",
        "Superficie": "Plataforma de apoyo; dimensiones por confirmar.",
        "Aplicación general": "Tareas de instalación, mantenimiento o inspección en altura.",
        "Datos de uso": "Altura de trabajo, capacidad y accionamiento por confirmar."
      },
      "mainImage": "img/plataforma-pe12-1.jpg",
      "gallery": [
        "img/plataforma-pe12-1.jpg",
        "img/plataforma-pe12-2.jpg",
        "img/plataforma-pe12-3.jpg",
        "img/plataforma-pe12-4.jpg"
      ],
      "buyMessage": "Hola, me interesa el producto de ejemplo de catálogo Plataforma Elevadora PE-12. Quisiera confirmar sus especificaciones e inventario."
    },
    {
      "id": "polipasto-pe05",
      "nombre": "Polipasto Eléctrico PE-05",
      "categoria": "Elevación",
      "descripcion": "El polipasto eléctrico PE-05 permite elevar y posicionar cargas mediante accionamiento eléctrico. Puede integrarse a una estructura de izaje compatible para apoyar maniobras verticales en el área de trabajo.",
      "precioAnterior": 42500,
      "descuento": 10,
      "stock": 12,
      ofertaInicio: "2026-10-15T00:00:00",
      ofertaFin: "2026-10-15T23:59:59",
      "caracteristicas": {
        "Accionamiento indicado": "Eléctrico según el nombre del producto.",
        "Movimiento": "Elevación vertical de cargas con equipo de izaje compatible.",
        "Instalación": "Soporte y configuración de montaje por confirmar.",
        "Parámetros de izaje": "Capacidad, recorrido y alimentación por confirmar."
      },
      "mainImage": "img/polipasto-pe05-1.jpg",
      "gallery": [
        "img/polipasto-pe05-1.jpg",
        "img/polipasto-pe05-2.jpg",
        "img/polipasto-pe05-3.jpg",
        "img/polipasto-pe05-4.jpg"
      ],
      "buyMessage": "Hola, me interesa el producto de ejemplo de catálogo Polipasto Eléctrico PE-05. Quisiera confirmar sus especificaciones e inventario."
    },
    {
      "id": "compresor-ci30",
      "nombre": "Compresor Industrial CI-30",
      "categoria": "Equipos industriales",
      "descripcion": "El compresor industrial CI-30 suministra aire comprimido para herramientas y procesos neumáticos compatibles. Apoya tareas de operación y mantenimiento donde se requiere una fuente de aire a presión.",
      "precioAnterior": 98000,
      "descuento": 20,
      "stock": 5,
      ofertaInicio: "2026-10-16T00:00:00",
      ofertaFin: "2026-10-16T23:59:59",
      "caracteristicas": {
        "Función": "Suministro de aire comprimido para aplicaciones compatibles.",
        "Uso general": "Apoyo a herramientas y procesos neumáticos.",
        "Componentes": "Depósito, conexiones y tipo de compresión por confirmar.",
        "Rendimiento": "Presión, caudal y potencia pendientes de confirmar."
      },
      "mainImage": "img/compresor-ci30-1.jpg",
      "gallery": [
        "img/compresor-ci30-1.jpg",
        "img/compresor-ci30-2.jpg",
        "img/compresor-ci30-3.jpg",
        "img/compresor-ci30-4.jpg"
      ],
      "buyMessage": "Hola, me interesa el producto de ejemplo de catálogo Compresor Industrial CI-30. Quisiera confirmar sus especificaciones e inventario."
    },
    {
      "id": "generador-gi25",
      "nombre": "Generador Industrial GI-25",
      "categoria": "Equipos industriales",
      "descripcion": "El generador industrial GI-25 proporciona energía eléctrica para apoyar equipos y actividades en espacios de trabajo. La carga conectada debe corresponder a las condiciones de operación del generador.",
      "precioAnterior": 125000,
      "descuento": 15,
      "stock": 8,
      ofertaInicio: "2026-10-17T00:00:00",
      ofertaFin: "2026-10-17T23:59:59",
      "caracteristicas": {
        "Función": "Generación de energía eléctrica.",
        "Aplicación": "Suministro para cargas compatibles según configuración.",
        "Conexiones": "Tipo y cantidad de salidas por confirmar.",
        "Parámetros de operación": "Potencia, combustible y autonomía pendientes de confirmar."
      },
      "mainImage": "img/generador-gi25-1.jpg",
      "gallery": [
        "img/generador-gi25-1.jpg",
        "img/generador-gi25-2.jpg",
        "img/generador-gi25-3.jpg",
        "img/generador-gi25-4.jpg"
      ],
      "buyMessage": "Hola, me interesa el producto de ejemplo de catálogo Generador Industrial GI-25. Quisiera confirmar sus especificaciones e inventario."
    },
    {
      "id": "transpaleta-th25",
      "nombre": "Transpaleta Hidráulica TH-25",
      "categoria": "Carga",
      "descripcion": "La transpaleta hidráulica TH-25 ayuda a levantar y desplazar pallets en almacenes y áreas de carga. Facilita el movimiento de materiales a nivel de piso durante tareas de recepción y organización.",
      "precioAnterior": 18500,
      "descuento": 12,
      "stock": 20,
      ofertaInicio: "2026-10-18T00:00:00",
      ofertaFin: "2026-10-18T23:59:59",
      "caracteristicas": {
        "Elevación": "Accionamiento hidráulico según el nombre del producto.",
        "Desplazamiento": "Movimiento de tarimas y cargas en recorridos de manejo interno.",
        "Elementos de maniobra": "Timón y horquillas; configuración por confirmar.",
        "Datos de carga": "Capacidad y dimensiones de horquillas pendientes de confirmar."
      },
      "mainImage": "img/transpaleta-th25-1.jpg",
      "gallery": [
        "img/transpaleta-th25-1.jpg",
        "img/transpaleta-th25-2.jpg",
        "img/transpaleta-th25-3.jpg",
        "img/transpaleta-th25-4.jpg"
      ],
      "buyMessage": "Hola, me interesa el producto de ejemplo de catálogo Transpaleta Hidráulica TH-25. Quisiera confirmar sus especificaciones e inventario."
    },
    {
      "id": "eslinga-ei05",
      "nombre": "Eslinga Industrial EI-05",
      "categoria": "Accesorios",
      "descripcion": "La eslinga industrial EI-05 se utiliza para sujetar y apoyar la elevación de cargas durante maniobras de izaje. La selección debe corresponder al tipo de carga y al sistema de elevación empleado.",
      "precioAnterior": 3200,
      "descuento": 10,
      "stock": 12,
      ofertaInicio: "2026-10-19T00:00:00",
      ofertaFin: "2026-10-19T23:59:59",
      "caracteristicas": {
        "Tipo": "Accesorio flexible para sujetar cargas en maniobras de izaje compatibles.",
        "Conexión": "Elemento de unión entre carga y equipo de elevación.",
        "Selección de uso": "Debe corresponder a la carga y al método de maniobra.",
        "Datos del accesorio": "Material, longitud, construcción y capacidad por confirmar."
      },
      "mainImage": "img/eslinga-ei05-1.jpg",
      "gallery": [
        "img/eslinga-ei05-1.jpg",
        "img/eslinga-ei05-2.jpg",
        "img/eslinga-ei05-3.jpg",
        "img/eslinga-ei05-4.jpg"
      ],
      "buyMessage": "Hola, me interesa el producto de ejemplo de catálogo Eslinga Industrial EI-05. Quisiera confirmar sus especificaciones e inventario."
    },
    {
      "id": "kit-accesorios-ka10",
      "nombre": "Kit de Accesorios para Grúa KA-10",
      "categoria": "Accesorios",
      "descripcion": "El kit de accesorios para grúa KA-10 reúne elementos destinados a complementar maniobras de manejo de cargas con una grúa. La aplicación depende de los componentes incluidos y del equipo con que se utilice.",
      "precioAnterior": 12500,
      "descuento": 18,
      "stock": 3,
      ofertaInicio: "2026-10-20T00:00:00",
      ofertaFin: "2026-10-20T23:59:59",
      "caracteristicas": {
        "Contenido de catálogo": "Conjunto de accesorios para grúa; piezas incluidas por confirmar.",
        "Aplicación": "Complemento para maniobras compatibles con grúas.",
        "Ajuste": "Compatibilidad con modelo y configuración por verificar.",
        "Identificación de piezas": "Función y cantidad de cada componente por confirmar."
      },
      "mainImage": "img/kit-accesorios-ka10-1.jpg",
      "gallery": [
        "img/kit-accesorios-ka10-1.jpg",
        "img/kit-accesorios-ka10-2.jpg",
        "img/kit-accesorios-ka10-3.jpg",
        "img/kit-accesorios-ka10-4.jpg"
      ],
      "buyMessage": "Hola, me interesa el producto de ejemplo de catálogo Kit de Accesorios para Grúa KA-10. Quisiera confirmar sus especificaciones e inventario."
    },
    {
      "id": "taladro-industrial-ti20",
      "nombre": "Taladro Industrial TI-20",
      "categoria": "Herramientas",
      "descripcion": "El taladro industrial TI-20 apoya trabajos de perforación en tareas de instalación, mantenimiento y fabricación. La broca y el material de trabajo deben ser compatibles con la herramienta.",
      "precioAnterior": 18000,
      "descuento": 15,
      "stock": 8,
      ofertaInicio: "2026-10-21T00:00:00",
      ofertaFin: "2026-10-21T23:59:59",
      "caracteristicas": {
        "Operación": "Perforación con broca o accesorio compatible.",
        "Aplicación": "Trabajos de instalación, mantenimiento o fabricación.",
        "Materiales": "Uso según la broca y el material admitido por el equipo.",
        "Datos de operación": "Potencia, velocidad y capacidad de sujeción por confirmar."
      },
      "mainImage": "img/taladro-industrial-ti20-1.jpg",
      "gallery": [
        "img/taladro-industrial-ti20-1.jpg",
        "img/taladro-industrial-ti20-2.jpg",
        "img/taladro-industrial-ti20-3.jpg",
        "img/taladro-industrial-ti20-4.jpg"
      ],
      "buyMessage": "Hola, quiero comprar el producto seleccionado."
    },
    {
      "id": "esmeril-industrial-ei07",
      "nombre": "Esmeril Industrial EI-07",
      "categoria": "Herramientas",
      "descripcion": "El esmeril industrial EI-07 se emplea en labores de desbaste y acabado de superficies. Apoya la preparación de piezas en taller con el accesorio adecuado para el material y la tarea.",
      "precioAnterior": 8500,
      "descuento": 12,
      "stock": 6,
      ofertaInicio: "2026-10-22T00:00:00",
      ofertaFin: "2026-10-22T23:59:59",
      "caracteristicas": {
        "Operación": "Desbaste o acabado con accesorio compatible.",
        "Aplicación": "Preparación de superficies y trabajos de taller.",
        "Consumible": "Tipo y dimensión del disco por confirmar.",
        "Datos de operación": "Potencia, velocidad y materiales admitidos por confirmar."
      },
      "mainImage": "img/esmeril-industrial-ei07-1.jpg",
      "gallery": [
        "img/esmeril-industrial-ei07-1.jpg",
        "img/esmeril-industrial-ei07-2.jpg",
        "img/esmeril-industrial-ei07-3.jpg",
        "img/esmeril-industrial-ei07-4.jpg"
      ],
      "buyMessage": "Hola, quiero comprar el producto seleccionado."
    },
    {
      "id": "llave-impacto-industrial-li15",
      "nombre": "Llave de Impacto Industrial LI-15",
      "categoria": "Herramientas",
      "descripcion": "La llave de impacto LI-15 facilita el apriete y desmontaje de fijaciones en trabajos de montaje y mantenimiento. Debe utilizarse con dados y conexiones compatibles con la herramienta.",
      "precioAnterior": 12500,
      "descuento": 10,
      "stock": 4,
      ofertaInicio: "2026-10-23T00:00:00",
      ofertaFin: "2026-10-23T23:59:59",
      "caracteristicas": {
        "Función": "Afloje o apriete de fijaciones mediante acción de impacto.",
        "Aplicación": "Mantenimiento y montaje de uniones mecánicas.",
        "Accesorio": "Dado y cuadro de conexión compatibles por confirmar.",
        "Parámetros de herramienta": "Torque, accionamiento y alimentación por confirmar."
      },
      "mainImage": "img/llave-impacto-industrial-li15-1.jpg",
      "gallery": [
        "img/llave-impacto-industrial-li15-1.jpg",
        "img/llave-impacto-industrial-li15-2.jpg",
        "img/llave-impacto-industrial-li15-3.jpg",
        "img/llave-impacto-industrial-li15-4.jpg"
      ],
      "buyMessage": "Hola, quiero comprar el producto seleccionado."
    },
    {
      "id": "atornillador-industrial-ai12",
      "nombre": "Atornillador Industrial AI-12",
      "categoria": "Herramientas",
      "descripcion": "El atornillador industrial AI-12 apoya tareas de fijación y ensamble mediante la instalación o retiro de tornillos. La punta y el tipo de fijación deben corresponder al trabajo realizado.",
      "precioAnterior": 9500,
      "descuento": 15,
      "stock": 7,
      ofertaInicio: "2026-10-24T00:00:00",
      ofertaFin: "2026-10-24T23:59:59",
      "caracteristicas": {
        "Función de ensamble": "Instalación o retiro de tornillos con punta compatible.",
        "Aplicación": "Armado, instalación y mantenimiento.",
        "Consumibles": "Tipo de puntas compatibles por confirmar.",
        "Parámetros de herramienta": "Torque, velocidad y accionamiento por confirmar."
      },
      "mainImage": "img/atornillador-industrial-ai12-1.jpg",
      "gallery": [
        "img/atornillador-industrial-ai12-1.jpg",
        "img/atornillador-industrial-ai12-2.jpg",
        "img/atornillador-industrial-ai12-3.jpg",
        "img/atornillador-industrial-ai12-4.jpg"
      ],
      "buyMessage": "Hola, quiero comprar el producto seleccionado."
    },
    {
      "id": "soldadora-industrial-si25",
      "nombre": "Soldadora Industrial SI-25",
      "categoria": "Herramientas",
      "descripcion": "La soldadora industrial SI-25 está destinada a trabajos de unión de piezas en actividades de fabricación, reparación o mantenimiento. El proceso y los consumibles dependen de la configuración del equipo.",
      "precioAnterior": 32000,
      "descuento": 18,
      "stock": 3,
      ofertaInicio: "2026-10-25T00:00:00",
      ofertaFin: "2026-10-25T23:59:59",
      "caracteristicas": {
        "Proceso": "Unión de piezas mediante proceso de soldadura por confirmar.",
        "Aplicación": "Trabajos de fabricación, reparación o mantenimiento.",
        "Consumibles": "Electrodos, alambre u otros consumibles según proceso compatible.",
        "Parámetros eléctricos": "Rango de salida, alimentación y ciclo de trabajo por confirmar."
      },
      "mainImage": "img/soldadora-industrial-si25-1.jpg",
      "gallery": [
        "img/soldadora-industrial-si25-1.jpg",
        "img/soldadora-industrial-si25-2.jpg",
        "img/soldadora-industrial-si25-3.jpg",
        "img/soldadora-industrial-si25-4.jpg"
      ],
      "buyMessage": "Hola, quiero comprar el producto seleccionado."
    },
    {
      "id": "cortadora-industrial-ci14",
      "nombre": "Cortadora Industrial CI-14",
      "categoria": "Herramientas",
      "descripcion": "La cortadora industrial CI-14 apoya el corte y dimensionado de materiales en trabajos de taller y fabricación. El accesorio de corte debe ser adecuado para el material y la operación.",
      "precioAnterior": 14500,
      "descuento": 12,
      "stock": 5,
      ofertaInicio: "2026-10-26T00:00:00",
      ofertaFin: "2026-10-26T23:59:59",
      "caracteristicas": {
        "Función": "Corte de materiales con accesorio compatible.",
        "Aplicación": "Separación o dimensionado de piezas en trabajos de taller.",
        "Consumible": "Tipo y medida de disco o cuchilla por confirmar.",
        "Capacidad de trabajo": "Materiales y dimensiones de corte por confirmar."
      },
      "mainImage": "img/cortadora-industrial-ci14-1.jpg",
      "gallery": [
        "img/cortadora-industrial-ci14-1.jpg",
        "img/cortadora-industrial-ci14-2.jpg",
        "img/cortadora-industrial-ci14-3.jpg",
        "img/cortadora-industrial-ci14-4.jpg"
      ],
      "buyMessage": "Hola, quiero comprar el producto seleccionado."
    },
    {
      "id": "pistola-impacto-industrial-pi10",
      "nombre": "Pistola de Impacto PI-10",
      "categoria": "Herramientas",
      "descripcion": "La pistola de impacto PI-10 aplica acción de impacto para apretar o aflojar fijaciones en tareas de montaje y mantenimiento. Los dados y accesorios deben ser compatibles con el equipo.",
      "precioAnterior": 7800,
      "descuento": 10,
      "stock": 9,
      ofertaInicio: "2026-10-27T00:00:00",
      ofertaFin: "2026-10-27T23:59:59",
      "caracteristicas": {
        "Acción": "Aplicación de impacto para apretar o aflojar fijaciones.",
        "Formato": "Herramienta manual para trabajos de montaje o mantenimiento.",
        "Compatibilidad": "Tipo de dados, acople y fijaciones por confirmar.",
        "Datos de funcionamiento": "Torque, velocidad y accionamiento por confirmar."
      },
      "mainImage": "img/pistola-impacto-industrial-pi10-1.jpg",
      "gallery": [
        "img/pistola-impacto-industrial-pi10-1.jpg",
        "img/pistola-impacto-industrial-pi10-2.jpg",
        "img/pistola-impacto-industrial-pi10-3.jpg",
        "img/pistola-impacto-industrial-pi10-4.jpg"
      ],
      "buyMessage": "Hola, quiero comprar el producto seleccionado."
    },
    {
      "id": "herramienta-hidraulica-hh08",
      "nombre": "Herramienta Hidráulica HH-08",
      "categoria": "Herramientas",
      "descripcion": "La herramienta hidráulica HH-08 está orientada a trabajos que requieren aplicación de fuerza hidráulica en entornos industriales. La operación y los accesorios dependen de la configuración del equipo.",
      "precioAnterior": 18500,
      "descuento": 20,
      "stock": 2,
      ofertaInicio: "2026-10-28T00:00:00",
      ofertaFin: "2026-10-28T23:59:59",
      "caracteristicas": {
        "Accionamiento": "Hidráulico según la descripción del producto.",
        "Uso general": "Herramienta para una operación de fuerza en entorno industrial.",
        "Interfaz": "Conexiones y accesorios compatibles por confirmar.",
        "Parámetros de trabajo": "Presión, fuerza y aplicación específica pendientes de confirmar."
      },
      "mainImage": "img/herramienta-hidraulica-hh08-1.jpg",
      "gallery": [
        "img/herramienta-hidraulica-hh08-1.jpg",
        "img/herramienta-hidraulica-hh08-2.jpg",
        "img/herramienta-hidraulica-hh08-3.jpg",
        "img/herramienta-hidraulica-hh08-4.jpg"
      ],
      "buyMessage": "Hola, quiero comprar el producto seleccionado."
    }
  ];

  products.forEach(product => {
    Object.defineProperties(product, {
      precioFinal: { enumerable: true, get: () => calcularPrecioFinal(product) },
      precio: { enumerable: true, get: () => calcularPrecioFinal(product) }
    });
  });

  const catalogGrid = document.querySelector("#catalog-grid");
  const productSearch = document.querySelector("#product-search");
  const categoryFilter = document.querySelector("#category-filter");
  const searchEmpty = document.querySelector("#search-empty");
  const productDialog = document.querySelector("#product-dialog");
  const productDetailContent = document.querySelector("#product-detail-content");
  const imageViewerDialog = document.querySelector("#image-viewer-dialog");
  const imageViewerImage = document.querySelector("#image-viewer-image");
  const imageViewerCaption = document.querySelector("#image-viewer-caption");
  const imageViewerThumbnails = document.querySelector("#image-viewer-thumbnails");
  const normalizeSearchText = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const getProductCategoryGroup = product => {
    const category = normalizeSearchText(product.categoria);
    if (category.includes("grua")) return "Grúas";
    if (category.includes("elevacion")) return "Elevación";
    if (category.includes("carga")) return "Carga";
    if (category.includes("accesorio")) return "Accesorios";
    if (category.includes("herramienta")) return "Herramientas";
    if (category.includes("maquinaria")) return "Maquinaria";
    return "Equipos industriales";
  };
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
  const formatPrice = value => value == null
    ? "Precio no especificado"
    : new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value) + " MXN";
  const renderOffer = (product, detail = false) => product.ofertaInicio && product.ofertaFin
    ? "<div class=\"catalog-offer" + (detail ? " catalog-offer-detail" : "") + "\" data-offer-countdown data-offer-product=\"" + escapeHtml(product.id) + "\" data-offer-start=\"" + escapeHtml(product.ofertaInicio) + "\" data-offer-end=\"" + escapeHtml(product.ofertaFin) + "\">" +
        "<p class=\"catalog-offer-label\" data-offer-state></p>" +
        "<p class=\"catalog-offer-date\" data-offer-start-label></p>" +
        "<p class=\"catalog-offer-date\" data-offer-end-label></p>" +
        "<p class=\"catalog-offer-prefix\" data-offer-prefix></p>" +
        "<span class=\"catalog-offer-clock\" data-offer-clock role=\"timer\" aria-label=\"Tiempo restante en la oferta\" aria-live=\"off\"></span>" +
        "<p class=\"catalog-offer-status\" data-offer-status aria-live=\"polite\"></p></div>"
    : "<div class=\"catalog-offer catalog-offer-empty\" aria-hidden=\"true\"></div>";
  const padOfferPart = value => String(value).padStart(2, "0");
  const parseOfferDate = value => {
    if (typeof value !== "string") return null;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, year, month, day, hour, minute, second] = match.map(Number);
    const date = new Date(year, month - 1, day, hour, minute, second);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day ||
        date.getHours() !== hour || date.getMinutes() !== minute || date.getSeconds() !== second) return null;
    return date;
  };
  const formatOfferDate = date =>
    padOfferPart(date.getDate()) + "/" + padOfferPart(date.getMonth() + 1) + "/" + date.getFullYear() +
    " a las " + padOfferPart(date.getHours()) + ":" + padOfferPart(date.getMinutes());
  const formatRelativeOfferEnd = (date, now) => {
    const localNow = new Date(now);
    const endIsToday = date.getFullYear() === localNow.getFullYear() &&
      date.getMonth() === localNow.getMonth() && date.getDate() === localNow.getDate();
    const tomorrow = new Date(localNow.getFullYear(), localNow.getMonth(), localNow.getDate() + 1);
    const endIsTomorrow = date.getFullYear() === tomorrow.getFullYear() &&
      date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate();
    const time = padOfferPart(date.getHours()) + ":" + padOfferPart(date.getMinutes());
    if (endIsToday) return "Termina hoy a las " + time;
    if (endIsTomorrow) return "Termina mañana a las " + time;
    return "Termina el " + formatOfferDate(date);
  };
  const getOfferState = (product, now = Date.now()) => {
    const start = parseOfferDate(product.ofertaInicio);
    const end = parseOfferDate(product.ofertaFin);
    if (!start || !end || end.getTime() <= start.getTime()) return "invalid";
    if (now < start.getTime()) return "upcoming";
    if (now < end.getTime()) return "active";
    return "finished";
  };
  const formatCountdown = milliseconds => {
    const secondsLeft = Math.max(0, Math.ceil(milliseconds / 1000));
    const days = Math.floor(secondsLeft / 86400);
    const hours = Math.floor((secondsLeft % 86400) / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;
    if (days > 0) return [days, hours, minutes, seconds].map(padOfferPart).join(":");
    return [Math.floor(secondsLeft / 3600), minutes, seconds].map(padOfferPart).join(":");
  };
  const getCurrentProductPrice = (product, offerState = getOfferState(product)) =>
    offerState === "active" ? product.precioFinal : product.precioAnterior;
  const renderProductPrices = (product, detail = false, offerState = getOfferState(product)) => {
    const hasDiscount = offerState === "active" && product.descuento > 0;
    const oldPrice = hasDiscount
      ? "<del class=\"catalog-old-price\">" + formatPrice(product.precioAnterior) + "</del>"
      : "";
    const discount = hasDiscount
      ? "<span class=\"catalog-discount\">" + escapeHtml(product.descuento) + "% OFF</span>"
      : "";
    const currentPriceClass = detail ? "product-detail-current-price" : "catalog-price catalog-price-current";
    const currentPrice = getCurrentProductPrice(product, offerState);
    return oldPrice + discount + "<strong class=\"" + currentPriceClass + "\">" + formatPrice(currentPrice) + "</strong>";
  };
  const updateOfferCountdown = timer => {
    const stateLabel = timer.querySelector("[data-offer-state]");
    const startLabel = timer.querySelector("[data-offer-start-label]");
    const endLabel = timer.querySelector("[data-offer-end-label]");
    const prefix = timer.querySelector("[data-offer-prefix]");
    const clock = timer.querySelector("[data-offer-clock]");
    const status = timer.querySelector("[data-offer-status]");
    const start = parseOfferDate(timer.dataset.offerStart);
    const end = parseOfferDate(timer.dataset.offerEnd);
    const now = Date.now();
    const state = !start || !end || end.getTime() <= start.getTime()
      ? "invalid"
      : now < start.getTime() ? "upcoming" : now < end.getTime() ? "active" : "finished";

    if (timer.dataset.offerPriceState !== state) {
      timer.dataset.offerPriceState = state;
      const product = products.find(item => item.id === timer.dataset.offerProduct);
      const offerContainer = timer.closest(".catalog-card, .product-detail");
      const priceContainer = offerContainer && offerContainer.querySelector("[data-product-prices]");
      if (product && priceContainer) {
        const isDetail = offerContainer.classList.contains("product-detail");
        priceContainer.innerHTML = renderProductPrices(product, isDetail, state);
        if (isDetail) {
          const buyLink = offerContainer.querySelector(".product-detail-actions .button.primary");
          if (buyLink) {
            buyLink.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildWhatsAppMessage(product, state));
          }
        }
      }
    }

    if (state === "invalid") {
      stateLabel.textContent = "OFERTA CON FECHAS PENDIENTES";
      startLabel.textContent = "Inicio: fecha pendiente";
      endLabel.textContent = "Término: fecha pendiente";
      prefix.hidden = true;
      clock.hidden = true;
      status.textContent = "Verifica las fechas de esta oferta.";
      return true;
    }

    const startText = formatOfferDate(start);
    const endText = formatOfferDate(end);
    startLabel.textContent = (state === "upcoming" ? "Inicia: " : state === "active" ? "Oferta inició: " : "Inició: ") + startText;
    endLabel.textContent = (state === "finished" ? "Terminó: " : "Termina: ") + endText;
    stateLabel.textContent = state === "upcoming" ? "OFERTA PRÓXIMA" : state === "active" ? "OFERTA ACTIVA" : "OFERTA FINALIZADA";

    if (state === "upcoming") {
      prefix.hidden = false;
      prefix.textContent = "Comienza en:";
      clock.hidden = false;
      clock.textContent = formatCountdown(start.getTime() - now);
      status.innerHTML = "<strong>LA OFERTA AÚN NO INICIA</strong><span>Comienza el " + escapeHtml(startText) + "</span>";
    } else if (state === "active") {
      prefix.hidden = false;
      prefix.textContent = "Oferta termina en:";
      clock.hidden = false;
      clock.textContent = formatCountdown(end.getTime() - now);
      status.textContent = formatRelativeOfferEnd(end, now);
    } else {
      prefix.hidden = true;
      clock.hidden = true;
      status.textContent = "La oferta terminó el " + endText;
    }
    return state === "finished";
  };
  const activeOfferTimers = new Set();
  let offerInterval = null;
  const updateAllOfferCountdowns = () => {
    [...activeOfferTimers].forEach(timer => {
      if (!timer.isConnected || updateOfferCountdown(timer)) activeOfferTimers.delete(timer);
    });
    if (activeOfferTimers.size === 0 && offerInterval !== null) {
      clearInterval(offerInterval);
      offerInterval = null;
    }
  };
  const startOfferCountdown = timer => {
    activeOfferTimers.add(timer);
    if (updateOfferCountdown(timer)) activeOfferTimers.delete(timer);
    if (activeOfferTimers.size > 0 && offerInterval === null) {
      offerInterval = setInterval(updateAllOfferCountdowns, 1000);
    }
  };
  const stopOfferCountdown = timer => {
    activeOfferTimers.delete(timer);
    if (activeOfferTimers.size === 0 && offerInterval !== null) {
      clearInterval(offerInterval);
      offerInterval = null;
    }
  };
  const initOfferCountdowns = () => {
    [...catalogGrid.querySelectorAll("[data-offer-countdown]")].forEach(startOfferCountdown);
  };
  const galleryImages = product => {
    const sources = Array.isArray(product.gallery) ? product.gallery.filter(Boolean) : [];
    if (product.mainImage && !sources.includes(product.mainImage)) sources.unshift(product.mainImage);
    return sources.map((src, index) => ({
      src,
      alt: index === 0 ? "Vista principal: " + product.nombre : "Vista " + (index + 1) + ": " + product.nombre
    }));
  };
  const renderImage = product => product.mainImage
    ? "<img data-product-image src=\"" + escapeHtml(product.mainImage) + "\" alt=\"" + escapeHtml(product.nombre) + "\" loading=\"lazy\">"
    : "<div class=\"catalog-image-placeholder\" role=\"img\" aria-label=\"Imagen pendiente para " + escapeHtml(product.nombre) + "\"><span aria-hidden=\"true\">&#9635;</span><span>Imagen pendiente</span></div>";
  const renderFeatures = product => {
    const entries = Object.entries(product.caracteristicas || {}).filter(([, value]) => value != null && value !== "");
    return entries.length
      ? "<ul class=\"catalog-features\">" + entries.map(([name, value]) => "<li><strong>" + escapeHtml(name) + ":</strong> " + escapeHtml(value) + "</li>").join("") + "</ul>"
      : "<p class=\"catalog-pending\">Características técnicas pendientes de información real.</p>";
  };
  const renderCard = product => {
    const hasDiscount = product.descuento > 0;
    const discount = hasDiscount
      ? "<span class=\"catalog-discount\">" + escapeHtml(product.descuento) + "% OFF</span>"
      : "";
    const oldPrice = hasDiscount
      ? "<del class=\"catalog-old-price\">" + formatPrice(product.precioAnterior) + "</del>"
      : "";
    const stock = product.stock == null
      ? "Stock: no especificado"
      : "Stock: " + escapeHtml(product.stock) + " unidades";
    return "<article class=\"catalog-card\" data-product-card=\"" + escapeHtml(product.id) + "\" role=\"group\" tabindex=\"0\" aria-current=\"false\" aria-label=\"Seleccionar producto: " + escapeHtml(product.nombre) + ". Pulsa Enter o espacio para abrir su detalle.\">" +
      "<div class=\"catalog-card-image\">" + renderImage(product) + "</div>" +
      "<div class=\"catalog-card-body\">" +

        "<p class=\"catalog-category\">" + escapeHtml(product.categoria) + "</p>" +
        "<h2 class=\"catalog-product-name\">" + escapeHtml(product.nombre) + "</h2>" +

        "<p class=\"catalog-card-description\">" + escapeHtml(product.descripcion) + "</p>" +
        "<div class=\"catalog-prices\" data-product-prices>" + renderProductPrices(product, false) + "</div>" +
        renderOffer(product) +
        "<p class=\"catalog-stock\">" + stock + "</p>" +
      "</div>" +
    "</article>";
  };
  const buildWhatsAppMessage = (product, offerState = getOfferState(product)) => {
    const stockMessage = product.stock == null
      ? ""
      : Number(product.stock) > 0
        ? " Stock disponible: " + String(product.stock) + " unidades."
        : " Estado de stock: agotado (0 unidades).";
    const message = String(product.buyMessage || "").trim();
    const includesProductName = message.toLowerCase().includes(String(product.nombre).toLowerCase());
    const productMessage = includesProductName ? "" : " Producto: " + product.nombre + ".";
    return message + productMessage + " Precio actual: " + formatPrice(getCurrentProductPrice(product, offerState)) + "." + stockMessage;
  };
  const renderProductGallery = product => {
    const images = galleryImages(product);
    const mainImage = images.length
      ? "<button class=\"catalog-gallery-main product-detail-main-image product-detail-zoom\" data-detail-zoom data-detail-viewer-open type=\"button\" aria-label=\"Abrir visor de im&aacute;genes de " + escapeHtml(product.nombre) + "\" aria-haspopup=\"dialog\"><img data-product-image data-detail-main-image src=\"" + escapeHtml(images[0].src) + "\" alt=\"" + escapeHtml(images[0].alt || product.nombre) + "\" loading=\"lazy\"><span class=\"product-detail-hover-lens\" data-detail-hover-lens aria-hidden=\"true\"></span><span class=\"product-detail-zoom-indicator\" aria-hidden=\"true\"></span></button>"
      : "<div class=\"catalog-gallery-main catalog-gallery-pending product-detail-main-image\" role=\"img\" aria-label=\"Imagen pendiente para " + escapeHtml(product.nombre) + "\"><span aria-hidden=\"true\">&#9635;</span><span>Imagen pendiente</span></div>";
    const pendingViews = ["Principal", "Lateral", "Posterior", "Detalle"];
    const thumbnails = images.length
      ? images.map((image, index) =>
          "<button class=\"catalog-gallery-thumb product-detail-thumbnail" + (index === 0 ? " selected" : "") + "\" type=\"button\" data-detail-gallery-index=\"" + index + "\" aria-label=\"Ver imagen " + (index + 1) + "\" aria-pressed=\"" + (index === 0) + "\"><img data-product-image src=\"" + escapeHtml(image.src) + "\" alt=\"\" loading=\"lazy\"></button>"
        ).join("")
      : pendingViews.map(view =>
          "<button class=\"catalog-gallery-thumb product-detail-thumbnail is-pending\" type=\"button\" disabled aria-label=\"" + view + " pendiente\"><span>" + view + "<br>Imagen pendiente</span></button>"
        ).join("");
    return "<div class=\"product-detail-gallery-column\"><div class=\"product-detail-image-stage\">" + mainImage + "</div><div class=\"catalog-gallery-thumbs\" aria-label=\"Im&aacute;genes del producto\">" + thumbnails + "</div></div>";
  };
  const renderProductDescription = product =>
    "<section class=\"product-detail-description-section\" aria-labelledby=\"product-description-title\">" +
      "<h3 class=\"product-detail-section-title\" id=\"product-description-title\">Descripci&oacute;n</h3>" +
      "<p class=\"product-detail-description\">" + escapeHtml(String(product.descripcion || "")) + "</p>" +
    "</section>";
  const renderProductDetail = product => {
    const hasDiscount = product.descuento > 0;
    const oldPrice = hasDiscount
      ? "<del class=\"catalog-old-price\">" + formatPrice(product.precioAnterior) + "</del>"
      : "";
    const discount = hasDiscount
      ? "<span class=\"catalog-discount\">" + escapeHtml(product.descuento) + "% OFF</span>"
      : "";
    const stockStatus = product.stock == null
      ? "Stock por confirmar"
      : Number(product.stock) > 0 ? "Stock disponible" : "Agotado";
    const stockQuantity = product.stock == null
      ? "Cantidad por confirmar"
      : Number(product.stock) > 0 ? escapeHtml(product.stock) + " unidades" : "0 unidades";
    const offer = product.ofertaInicio && product.ofertaFin ? renderOffer(product, true) : "";
    return "<article class=\"product-detail\">" +
      "<div class=\"product-detail-layout\">" +
        renderProductGallery(product) +
        "<div class=\"product-detail-info\">" +
          "<div class=\"product-detail-back-row\"><button class=\"catalog-text-link\" type=\"button\" data-close-product><span aria-hidden=\"true\">&#8592;</span> Volver al cat&aacute;logo</button></div>" +
        "<p class=\"catalog-category\">" + escapeHtml(product.categoria) + "</p>" +
          "<h2 class=\"product-detail-title\" id=\"product-detail-title\">" + escapeHtml(product.nombre) + "</h2>" +
          renderProductDescription(product) +

          "<section class=\"product-detail-features\" aria-labelledby=\"product-features-title\">" +
            "<h3 class=\"product-detail-section-title\" id=\"product-features-title\" tabindex=\"-1\">Caracter&iacute;sticas</h3>" +
            renderFeatures(product) +
          "</section>" +
          "<div class=\"product-detail-prices\" data-product-prices>" + renderProductPrices(product, true) + "</div>" +
          offer +
          "<div class=\"product-detail-availability\"><strong>" + stockStatus + "</strong><span>" + stockQuantity + "</span></div>" +
          "<div class=\"product-detail-actions\">" +
            "<a class=\"button primary\" href=\"https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildWhatsAppMessage(product)) + "\" target=\"_blank\" rel=\"noopener noreferrer\">Comprar</a>" +

          "</div>" +


       "</div>" +
       "<div class=\"product-detail-lens\" data-detail-lens aria-hidden=\"true\"></div>" +
      "</div>" +
    "</article>";
  };
  let viewerProduct = null;
  let viewerImages = [];
  let viewerIndex = 0;
  let viewerReturnFocus = null;
  const hideDetailLens = surface => {
    const productDetail = surface && surface.closest(".product-detail");
    const lens = productDetail && productDetail.querySelector("[data-detail-lens]");
    const hoverLens = surface && surface.querySelector ? surface.querySelector("[data-detail-hover-lens]") : null;
    if (lens) {
      lens.classList.remove("is-active");
      lens.setAttribute("aria-hidden", "true");
    }
    if (hoverLens) hoverLens.classList.remove("is-active");
  };
  const setDetailGalleryImage = (product, index) => {
    const images = galleryImages(product);
    if (!images.length) return;
    const selectedIndex = ((index % images.length) + images.length) % images.length;
    const image = images[selectedIndex];
    let mainImage = productDetailContent.querySelector("[data-detail-main-image]");
    if (!mainImage) {
      const placeholder = productDetailContent.querySelector(".product-detail-main-image");
      if (!placeholder) return;
      mainImage = document.createElement("img");
      mainImage.setAttribute("data-product-image", "");
      mainImage.setAttribute("data-detail-main-image", "");
      mainImage.loading = "lazy";
      placeholder.replaceWith(mainImage);
    }
    mainImage.hidden = false;
    mainImage.src = image.src;
    mainImage.alt = image.alt || product.nombre;
    hideDetailLens(mainImage);

    const zoomSurface = mainImage.closest("[data-detail-zoom]");
    if (zoomSurface) {
      zoomSurface.classList.remove("is-pending");
      const pendingLabel = zoomSurface.querySelector(".product-detail-image-pending-label");
      if (pendingLabel) pendingLabel.remove();
    }
    productDetailContent.querySelectorAll("[data-detail-gallery-index]").forEach(button => {
      const selected = Number(button.dataset.detailGalleryIndex) === selectedIndex;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  };
  const setViewerImage = index => {
    if (!viewerProduct || !viewerImages.length) return;
    viewerIndex = ((index % viewerImages.length) + viewerImages.length) % viewerImages.length;
    const image = viewerImages[viewerIndex];
    imageViewerImage.src = image.src;
    imageViewerImage.alt = image.alt || viewerProduct.nombre;
    imageViewerCaption.textContent = viewerProduct.nombre + " · " + (viewerIndex + 1) + " de " + viewerImages.length;
    imageViewerThumbnails.querySelectorAll("[data-viewer-index]").forEach(button => {
      const selected = Number(button.dataset.viewerIndex) === viewerIndex;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    setDetailGalleryImage(viewerProduct, viewerIndex);
  };
  const openImageViewer = (product, index, trigger) => {
    viewerProduct = product;
    viewerImages = galleryImages(product);
    if (!viewerImages.length) return;
    viewerReturnFocus = trigger;
    hideDetailLens(trigger);
    imageViewerDialog.setAttribute("aria-label", "Visor de imágenes: " + product.nombre);
    imageViewerThumbnails.innerHTML = viewerImages.map((image, imageIndex) =>
      "<button class=\"image-viewer-thumbnail" + (imageIndex === index ? " selected" : "") + "\" type=\"button\" data-viewer-index=\"" + imageIndex + "\" aria-label=\"Ver imagen " + (imageIndex + 1) + "\" aria-pressed=\"" + (imageIndex === index) + "\"><img src=\"" + escapeHtml(image.src) + "\" alt=\"\"></button>"
    ).join("");
    imageViewerDialog.showModal();
    setViewerImage(index);
  };
  catalogGrid.innerHTML = products.map(renderCard).join("");
  initOfferCountdowns();
  const productCards = [...catalogGrid.querySelectorAll("[data-product-card]")];
  const selectProductCard = selectedCard => {
    productCards.forEach(card => {
      const selected = card === selectedCard;
      const productName = card.querySelector(".catalog-product-name").textContent.trim();
      card.classList.toggle("is-selected", selected);
      card.setAttribute("aria-current", String(selected));
      card.setAttribute("aria-label", selected
        ? "Producto seleccionado: " + productName
        : "Seleccionar producto: " + productName + ". Pulsa Enter o espacio para abrir su detalle.");
    });
  };
  let lastSelectedCard = null;
  const openProductDetail = card => {
    const product = products.find(item => item.id === card.dataset.productCard);
    if (!product) return;
    lastSelectedCard = card;
    productDialog.dataset.productId = product.id;
    productDialog.setAttribute("aria-label", product.nombre);
    productDetailContent.innerHTML = renderProductDetail(product);
    productDialog.showModal();
    const timer = productDetailContent.querySelector("[data-offer-countdown]");
    if (timer) startOfferCountdown(timer);
  };
  productCards.forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest("a, button, input, select, textarea, summary")) return;
      selectProductCard(card);
      openProductDetail(card);
    });
    card.addEventListener("keydown", event => {
      if (event.target !== card || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      selectProductCard(card);
      openProductDetail(card);
    });
  });

  const handleProductImageError = event => {
    const image = event.target;
    if (!image || typeof image.matches !== "function" || !image.matches("img[data-product-image]")) return;
    const thumbnail = image.closest(".catalog-gallery-thumb");
    if (thumbnail) {
      image.hidden = true;
      thumbnail.classList.add("image-pending");
      thumbnail.disabled = true;
      thumbnail.setAttribute("aria-label", "Vista pendiente");
      return;
    }
    const detailZoom = image.closest("[data-detail-zoom]");
    if (detailZoom) {
      image.hidden = true;
      hideDetailLens(detailZoom);
      detailZoom.classList.add("is-pending");

      if (!detailZoom.querySelector(".product-detail-image-pending-label")) {
        const pendingLabel = document.createElement("span");
        pendingLabel.className = "product-detail-image-pending-label";
        pendingLabel.textContent = "Imagen pendiente";
        detailZoom.appendChild(pendingLabel);
      }
      return;
    }
    const placeholder = document.createElement("div");
    const inGallery = Boolean(image.closest(".catalog-gallery-main"));
    placeholder.className = inGallery ? "catalog-gallery-pending" : "catalog-image-placeholder";
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute("aria-label", "Imagen pendiente para " + (image.alt || "producto"));
    placeholder.textContent = "Imagen pendiente";
    image.replaceWith(placeholder);
  };
  catalogGrid.addEventListener("error", handleProductImageError, true);
  productDetailContent.addEventListener("error", handleProductImageError, true);

  const getProductSearchText = product => [product.nombre, product.categoria, product.descripcion, ...Object.entries(product.caracteristicas || {}).flatMap(entry => entry)].join(" ");
  const applyCatalogFilters = () => {
    const query = normalizeSearchText(productSearch.value.trim());
    const selectedCategory = categoryFilter.value;
    let matchingProducts = 0;
    productCards.forEach(card => {
      const product = products.find(item => item.id === card.dataset.productCard);
      if (!product) return;
      const imageDescriptions = [...card.querySelectorAll("img[alt]")].map(image => image.alt).join(" ");
      const matchesQuery = normalizeSearchText(getProductSearchText(product) + " " + card.textContent + " " + imageDescriptions).includes(query);
      const matchesCategory = !selectedCategory || getProductCategoryGroup(product) === selectedCategory;
      const matches = matchesQuery && matchesCategory;
      card.hidden = !matches;
      if (matches) matchingProducts += 1;
    });
    searchEmpty.hidden = matchingProducts > 0;
  };
  productSearch.addEventListener("input", applyCatalogFilters);
  categoryFilter.addEventListener("change", applyCatalogFilters);
  const clearProductDetail = () => {
    const timer = productDetailContent.querySelector("[data-offer-countdown]");
    if (timer) stopOfferCountdown(timer);
    productDetailContent.innerHTML = "";
    const cardToFocus = lastSelectedCard;
    lastSelectedCard = null;
    if (cardToFocus && cardToFocus.isConnected) cardToFocus.focus();
  };
  const closeProductDialog = () => {
    if (productDialog.open) productDialog.close();
    clearProductDetail();
  };
  productDialog.addEventListener("close", clearProductDetail);
  productDialog.addEventListener("click", event => {
    if (event.target.closest("[data-close-product]")) {
      closeProductDialog();
    }
  });
  imageViewerDialog.addEventListener("click", event => {
    if (event.target.closest("[data-viewer-close]")) {
      imageViewerDialog.close();
      return;
    }
    if (event.target.closest("[data-viewer-previous]")) {
      setViewerImage(viewerIndex - 1);
      return;
    }
    if (event.target.closest("[data-viewer-next]")) {
      setViewerImage(viewerIndex + 1);
      return;
    }
    const thumbnail = event.target.closest("[data-viewer-index]");
    if (thumbnail) setViewerImage(Number(thumbnail.dataset.viewerIndex));
  });
  imageViewerDialog.addEventListener("keydown", event => {
    if (event.target.closest("input, textarea, select, [contenteditable=\"true\"]")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setViewerImage(viewerIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setViewerImage(viewerIndex + 1);
    }
  });
  imageViewerDialog.addEventListener("close", () => {
    const focusTarget = viewerReturnFocus;
    viewerReturnFocus = null;
    viewerProduct = null;
    viewerImages = [];
    if (focusTarget && focusTarget.isConnected) focusTarget.focus();
  });
  productDetailContent.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;
    const surface = event.target.closest("[data-detail-zoom]");
    const productDetail = surface && surface.closest(".product-detail");
    const lens = productDetail && productDetail.querySelector("[data-detail-lens]");
    const hoverLens = surface && surface.querySelector("[data-detail-hover-lens]");
    const image = surface && surface.querySelector("[data-detail-main-image]");
    if (!surface || !lens || !image || image.hidden || !image.naturalWidth || !image.naturalHeight) return;
    const frame = surface.getBoundingClientRect();
    const fitScale = Math.min(frame.width / image.naturalWidth, frame.height / image.naturalHeight);
    const renderedWidth = image.naturalWidth * fitScale;
    const renderedHeight = image.naturalHeight * fitScale;
    const imageLeft = frame.left + (frame.width - renderedWidth) / 2;
    const imageTop = frame.top + (frame.height - renderedHeight) / 2;
    const localX = event.clientX - imageLeft;
    const localY = event.clientY - imageTop;
    if (localX < 0 || localX > renderedWidth || localY < 0 || localY > renderedHeight) {
      hideDetailLens(surface);
      return;
    }
    const hoverWidth = hoverLens ? Math.min(150, Math.max(96, renderedWidth * 0.22)) : 0;
    const hoverHeight = hoverLens ? Math.min(110, Math.max(72, renderedHeight * 0.22)) : 0;
    if (hoverLens) {
      const halfW = hoverWidth / 2;
      const halfH = hoverHeight / 2;
      const hoverX = Math.min(Math.max(localX - halfW, 0), Math.max(0, renderedWidth - hoverWidth));
      const hoverY = Math.min(Math.max(localY - halfH, 0), Math.max(0, renderedHeight - hoverHeight));
      hoverLens.style.width = hoverWidth + "px";
      hoverLens.style.height = hoverHeight + "px";
      hoverLens.style.left = (imageLeft - frame.left + hoverX) + "px";
      hoverLens.style.top = (imageTop - frame.top + hoverY) + "px";
      hoverLens.classList.add("is-active");
    }
    const zoomFactor = 3.2;
    const lensBounds = lens.getBoundingClientRect();
    const backgroundWidth = renderedWidth * zoomFactor;
    const backgroundHeight = renderedHeight * zoomFactor;
    const backgroundX = Math.min(0, Math.max(lensBounds.width - backgroundWidth, lensBounds.width / 2 - localX * zoomFactor));
    const backgroundY = Math.min(0, Math.max(lensBounds.height - backgroundHeight, lensBounds.height / 2 - localY * zoomFactor));
    lens.style.backgroundImage = "url(" + JSON.stringify(image.currentSrc || image.src) + ")";
    lens.style.backgroundSize = backgroundWidth + "px " + backgroundHeight + "px";
    lens.style.backgroundPosition = backgroundX + "px " + backgroundY + "px";
    lens.classList.add("is-active");
    lens.setAttribute("aria-hidden", "false");
  });
  productDetailContent.addEventListener("pointerout", event => {
    const surface = event.target.closest("[data-detail-zoom]");
    if (event.pointerType !== "mouse" || !surface || (event.relatedTarget && surface.contains(event.relatedTarget))) return;
    hideDetailLens(surface);
  });
  productDetailContent.addEventListener("click", event => {
    const viewerTrigger = event.target.closest("[data-detail-viewer-open]");
    if (viewerTrigger) {
      const product = products.find(item => item.id === productDialog.dataset.productId);
      if (!product) return;
      const selectedThumbnail = productDetailContent.querySelector(".product-detail-thumbnail.selected");
      openImageViewer(product, Number(selectedThumbnail ? selectedThumbnail.dataset.detailGalleryIndex : 0), viewerTrigger);
      return;
    }
    const thumbnail = event.target.closest("[data-detail-gallery-index]");
    if (!thumbnail || thumbnail.disabled) return;
    const product = products.find(item => item.id === productDialog.dataset.productId);
    if (!product) return;
    setDetailGalleryImage(product, Number(thumbnail.dataset.detailGalleryIndex));
  });

  const menu = document.querySelector(".menu");
  const nav = document.querySelector("#nav");
  const closeMenu = () => {
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Abrir men\u00fa");
    nav.classList.remove("open");
  };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Cerrar men\u00fa" : "Abrir men\u00fa");
    nav.classList.toggle("open", open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !productDialog.open) {
      closeMenu();
      menu.focus();
    }
  });
  document.querySelector("#year").textContent = String(new Date().getFullYear());
})();