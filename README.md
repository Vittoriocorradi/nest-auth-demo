# Per iniziare:

- `npm install`

- Creare un file **.env** (si può copiare **.env.example**, rinominarlo in **.env** e riempire con i dati)

- Collegare il progetto al database (inserire in **.env** o in **schema.prisma** l'url del database)

- *(Se non esiste già un database)* `npx prisma db push`
- *(Se esite già un database)* `npx prisma db pull`

- `npx prisma generate`

- `npm run start:dev`  




# Guida:

## Prisma

Installare Prisma

  - `npm i prisma --save-dev`

Inizializzare prisma

  - `npx prisma init`

Verrà creato un file **schema.prisma** nel folder **prisma**. In **schema.prisma** creare una connessione con il database indicando il provider utilizzato e l'url del db.  

Se esiste già un db, lanciare `npx prisma db pull`, altrimenti lanciare `npx prisma db pull`.

Installare e generare un prisma client

 - `npm install @prisma/client`

In caso di modifiche allo schema di prisma, lanciare il comando `npx prisma generate`.

Creare, a livello di **root**, un file **prisma.service.ts**.

## Autenticazione

Creare un module, un controller e un server auth per gestire l'autenticazione (il folder **auth** verrà creato automaticamente eseguendo i comandi)

  - `npm g module auth`
  - `npm g controller auth`
  - `npm g service auth`  

Creare in **prisma.schema** un modello per gli utenti, **Users**, con id autoincrement, username, password, refresh_jwt (stringa salvata nel database per refreshare il token una volta scaduto) e timestamps.

In **auth.module.ts** importare **PrismaService** e **AuthService** e registrarli come *providers*.

Installare il pacchetto per utilizzare i **JWT** (Json Web Token):  
 `npm install --save @nestjs/jwt`

Creare un file **constant.ts** in cui si andrà a esportare un **segreto** per generare i jwt.

In **auth.module.ts** importare **JwtModule** e **jwtConstants** e inserire tra gli *imports* **JwtModule**

In **auth.controller.ts** (/auth) creare le rotte per registrare un utente (POST /register), effettuare il login (POST /login) e refreshare il jwt token (POST /refresh)

In **auth.service.ts** creare i seguenti metodi:

  - **register** per registrare un nuovo utente. Passare dalla richiesta alla funzione un username e una password. Controllare se l'utente esista già. Se l'utente non è già registrato, salvaro sul database.

  - **signIn** per effettuare il login. Passare dalla richesta alla funzione un username e una password. Se l'utente non esiste o la password è incorretta, lanciare un errore.  
  Se l'utente esiste, generare e salvare sul database un refresh token per l'utente che ha appena effettuato il login.

  - **checkRefreshToken** per controllare se il token sia scaduto e nel caso controllare se il refresh token nella richiesta combaci con quello salvato sul database: se combacia, inviare un nuovo token. 

Creare un file **auth.guards.ts** in cui si andrà a inserire la logica per verificare la presenza di un jwt nelle chiamate. Il jwt verrà estratto dall'header della richiesta e verrà controllato. In caso di jwt valido, la chiamata può continuare, altrimenti verrà restituito un errore. Questa guardia si può usare verificare l'autenticazione prima di eseguire la logica nelle rotte se richiamato con il decoratore `@UseGuards(AuthGuard)`.




