# Examen Primera

# Día 03/12/2018 Tiempo: 5 horas

- Nota: Cada pregunta se valorará como bien o como mal (valoraciones intermedias serán excepcionales).
- Nota2: En cada pregunta se especifica si se valora en el examen de diseño o en el de desarrollo.
- Nota3: Para aprobar cada examen hay que obtener una puntuación mínima de 5 puntos en ese examen.
- Nota4: Organice su tiempo. Si no consigue resolver un apartado pase al siguiente. El examen consta de ejercicios que se pueden resolver de forma independiente. Los apartados de diseño y de desarrollo también se pueden resolver por separado. Si un apartado depende de otro que no sabe resolver, siempre puede dar una solución que aunque no sea correcta, le permita seguir avanzando.
- Nota5: Para que una solución sea correcta, no sólo hay que conseguir que haga lo que se pide, sino que además todo lo que funcionaba lo tiene que seguir haciendo.
- Nota6: En el examen se le da implementado el servidor y no se puede modificar. Cualquier modificación del servidor, invalidará las preguntas que se hayan resuelto y que usen esa modificación. También se le dan resueltas las consultas de `graphQL` de cliente. Es libre de modificar cualquiera de ellas.
- Nota7: Lea completamente el examen antes de empezar y comience por lo que le parezca más fácil.

Pasos previos antes de empezar:

- Clone el repositorio del enunciado

```bash
    git clone https://user-daw-zayas@bitbucket.org/surtich/chatty-enunciado-primera.git
```

- Configure su usuario de Git (es único para todos)

```bash
    cd chatty-enunciado-primera
    git config user.name "user-daw-zayas"
    git config user.email "javier.perezarteaga@educa.madrid.org"
```

- Cree un _branch_ con su nombre y apellidos separados con guiones (no incluya mayúsculas, acentos o caracteres no alfabéticos, excepción hecha de los guiones). Ejemplo:

```bash
    git checkout -b fulanito-perez-gomez
```

- Compruebe que está en la rama correcta:

```bash
    git status
```

- Suba la rama al repositorio remoto:

```bash
    git push origin nombre-de-la-rama-dado-anteriormente
```

- Arranque el proyecto.

```bash
    # Instale dependencias del servidor
    yarn install

    # Inicie el servidor
    yarn start

    # Instale dependencias del cliente
    cd client
    yarn install

    # Configure el cliente
    echo SERVER_URL=YOUR_IP:8080 > .env

    # Inicie el emulador de Andorid

    # Despliegue el cliente en el emulador
    react-native start --reset-cache
    react-native run-android
```

- Compruebe que la aplicación se ve en el móvil y que carga datos del servidor.

- Dígale al profesor que ya ha terminado para que compruebe que todo es correcto y desconecte la red.

## EXAMEN

Se trata de implementar un CRUD de amigos.

#### 1.- Mostrar amigos.

#### 1.1- (0,5 puntos diseño) Cree un una nueva pestaña que al pulsarla navegue a `friends`.

![image1.1](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image1.1.png)

#### 1.2- Al pulsar sobre `friends` se mostrarán los amigos del usuario 1.

![image1.2](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image1.2.png)

#### 1.2.1- (1 punto diseño) Por respetar los estilos y usar un `FlatList`.

#### 1.2.2- (1 punto desarrollo) Por cargar los amigos del usuario 1 del servidor.

#### 2.- Añadir amigos.

#### 2.1.- (1 punto diseño) Al final de la pantalla se mostrará un `TextInput` y un `Button` para añadir amigos. Respete colores, tamaños y márgenes.

![image2.1](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image2.1.png)

#### 2.2.- (0,5 puntos diseño) Al poner el foco en el `TextInput` el teclado será numérico (consulte la documentación del componente).

![image2.2](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image2.2.png)

#### 2.3.- (0,5 puntos diseño) El `TextInput` estará deshabilitado cuando el texto esté vacío y habilitado cuando no lo esté.

![image2.3](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image2.3.png)

#### 2.4.- (1,5 puntos desarrollo) Al pulsar sobre `Invite friend` se llamará a la mutación `create-friend-invitation.mutation` con el `id` del parámetro introducido.

#### 2.5.- (0,5 puntos diseño) Al pulsar sobre `Invite friend` se ocultará el teclado y se limpiará el `TextInput` y se navegará a `Your Invitations` (esto último se explica en el apartado 3.6).

#### 2.6.- (0,5 puntos diseño) El servidor puede dar errores al añadir la invitación (por ejemplo por que ya sois amigos). Si el servidor da error, se notificará en un componente `Alert` (consulte la documentación). En caso de errores, no se hará lo dicho en el punto 2.5.

![image2.6](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image2.6.png)

#### 2.7.- Habrá un botón que permitirá borrar amigos.

![image2.7](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image2.7.png)

#### 2.7.1.- (1 punto diseño) Por respetar exactamente los estilos.

Nota: El icono que debe usar tiene por `name` el valor `times-circle`

#### 2.7.2- (1 punto desarrollo) Por llamar a la mutación `delete-friend.mutation` y actualizar la vista.

#### 3.- Ver invitaciones de amistad.

#### 3.1.- (0,5 puntos diseño) Al final de la pantalla `Friends` se verán tres botones con los estilos y colores que se muestran en la imagen.

![image3.1](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image3.1.png)

#### 3.2.- (1 punto diseño) Al pulsar sobre cada botón se cambiará el título de la ventana. El botón de `Friends` cambiará el título a `Friends` y seguirá mostrando lo que ya se mostraba al navegar.

Nota: Puede resultar difícil de hacer.

![image3.2](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image3.2.png)

![image3.2b](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image3.2b.png)

#### 3.3.- (0,5 puntos diseño) Al pulsar se mostrará el texto de las anteriores imágenes.

#### 3.4.- (1 punto diseño) Al pulsar se ocultará el botón pulsado y se mostrarán el resto de opciones.

![image3.4](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image3.4.png)

![image3.4b](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image3.4b.png)

![image3.4bb](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image3.4bb.png)

#### 3.5.- (0,5 puntos diseño) Al pulsar el botón `back` se navegará a `Chats` directamente incluso si se han pulsado varios botones y se mantendrá el título del último botón pulsado, es decir, si lo último pulsado es `Invitations` se verá ese texto y al pulsar se verá el texto `You do not have invitations`.

Nota: Quizás la forma más fácil de hacer esto es usar un componente createSwitchNavigator (ver documentación).

#### 3.6.- Al pulsar sobre `Your Invitations`, si ha creado invitaciones, se mostrarán.

Nota: recuerde el apartado 2.5, en el que al añadir una invitación, se navegará a `Your Invitations`

![image3.6](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image3.6.png)

#### 3.6.1.- (0,5 puntos diseño) Por mostrar los estilos de la imagen.

Nota: El icono que debe usar tiene por `name` el valor `times-circle`

Nota2: Observe que ya no se muestra la caja de texto y el botón que permite añadir invitaciones. Esto hay que hacerlo para que se valore este apartado.

#### 3.6.2.- (1,5 puntos desarrollo) Por leer las invitaciones emitidas por el usuario 1 del servidor y mostrarlas.

#### 3.6.3.- (1 punto desarrollo) Observe que si se pulsa sobre `x` se cancelará la invitación. Es decir, se llamará a la mutación `cancel-friend-invitation.mutation` y se actualizará la vista `Your Invitations`.

#### 3.7.- Al pulsar sobre `Invitations`, si ha recibido invitaciones, se mostrarán.

![image3.7](https://bitbucket.org/surtich/chatty-enunciado-primera/downloads/image3.7.png)

#### 3.7.1.- (0,5 puntos diseño) Por mostrar los estilos de la imagen.

Nota: Los iconos tienen por `name` los valores `plus-circle` y `times-circle`

#### 3.7.2.- (1 punto desarrollo) Por leer las invitaciones recibidas por el usuario 1 del servidor y mostrarlas.

#### 3.7.3.- (1 punto desarrollo) Observe que si se pulsa sobre `x` se cancelará la invitación. Es decir, se llamará a la mutación y se actualizará la vista.

#### 3.7.4.- (2 puntos desarrollo) Si se pulsa sobre `+` se borrará igualmente la invitación (llamando a la mutación `accept-friend-invitation.mutation`) y se actualizará la vista `Friends` con el nuevo amigo.

## Para entregar

- Ejecute el siguiente comando para comprobar que está en la rama correcta y ver los ficheros que ha cambiado:

```bash
    git status
```

- Prepare los cambios para que se añadan al repositorio local:

```bash
    git add --all
    git commit -m "completed exam"
```

- Compruebe que no tiene más cambios que incluir:

```bash
    git status
```

- Dígale al profesor que va a entregar el examen.

- Conecte la red y ejecute el siguiente comando:

```bash
    git push origin <nombre-de-la-rama>
```

- Abandone el aula en silencio.
