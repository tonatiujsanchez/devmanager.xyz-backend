## Server con Typescript


1. Inicializar proyectos de node
```
npm init -y
```

2. Inicializar Tipescript
```
tsc --init
```

3. Configuraciones en __tsconfig.json__ (Descomentar o agregar)
```
{
    "moduleResolution": "node",
    "sourceMap": true,
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
}

```

4. Instalación del tslint
```
npm i tslint --save-dev
```

5. Instalación del typescript
```
npm i typescript --save-dev
```

6. Crear archivo de configuración de __tslint__ 
```
./node_modules/.bin/tslint --init
```

7. Configuración en el archivo __tslint.json__
```
"rules": {
    "no-console": false
},
```

8. Compilar typescript con el comando
```
tsc 
```

9. Correr app de javascript compilado con Node o Nodemon
```
node dist/app.js
```

10. Para manterner el servidor corriendo y compilando, ejecutar los siguienter comandos ( En terminales diferentes ubicandonos en el proyecto):

    - Para mantener compilando typescript en cada cambio
    ``` 
        tsc --watch
    ```
    - Para mantener corriendo el proyecto compilado
    ``` 
        - nodemon dist/app.js
    ```