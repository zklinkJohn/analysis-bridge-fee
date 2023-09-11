# analysis-bridge-fee
Analysis layer2 bridge fee

## install

```
git clone  git@github.com:zklinkJohn/analysis-bridge-fee.git
```

```
cd analysis-bridge-fee
```

```
npm install
```

## config `.env`

```
cp .env.example .env
```

## linea

initialize database
```
npm run db:linea
```

sync blockchain data to database
```
sync:linea
```

analysis

```
analysis:linea
```
