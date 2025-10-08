import { Client } from 'pg';

function mask(v: string | undefined) {
  if (!v) return '(empty)';
  if (v.length <= 2) return '*'.repeat(v.length);
  return v[0] + '*'.repeat(v.length - 2) + v[v.length - 1];
}

async function ensureDatabase() {
  const dbName = process.env.DB_NAME || 'medicine_db';

  // Allow full DATABASE_URL override (common in hosting providers)
  const databaseUrl = process.env.DATABASE_URL;
  let clientConfig: any;
  if (databaseUrl) {
    clientConfig = { connectionString: databaseUrl }; // Will connect directly
    console.log('[db:create] Using DATABASE_URL (database part will be ignored if different).');
  } else {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '5432', 10);
    const user = process.env.DB_USER || 'postgres';
    const pass = process.env.DB_PASS || 'postgres';
    clientConfig = { host, port, user, password: pass, database: 'postgres' };
    console.log('[db:create] Connection attempt:');
    console.log(`  host=${host}`);
    console.log(`  port=${port}`);
    console.log(`  user=${user}`);
    console.log(`  password=${mask(pass)}`);
  }

  const admin = new Client(clientConfig);
  try {
    await admin.connect();
  } catch (e: any) {
    if (e && e.code === '28P01') {
      console.error('\n[ERROR] Authentication failed (code 28P01).');
      console.error('Tips:');
      console.error('  • Parola doğru mu? pgAdmin veya psql ile test edin.');
      console.error('  • .env dosyasında DB_USER / DB_PASS eşleşiyor mu?');
      console.error('  • Windows kurulumunda bazen postgres kullanıcısının parolası boş değil – yükleme sırasında seçtiğiniz parolayı girin.');
      console.error('  • Gerekirse psql üzerinden yeni kullanıcı oluşturun:');
      console.error("    CREATE USER med_user WITH PASSWORD 'StrongPass123';");
      console.error("    CREATE DATABASE medicine_db OWNER med_user; GRANT ALL PRIVILEGES ON DATABASE medicine_db TO med_user;");
      console.error('  • Sonra .env içinde DB_USER / DB_PASS değerlerini güncelleyin.');
    } else {
      console.error('[ERROR] Connection failed:', e);
    }
    process.exitCode = 1;
    return;
  }

  try {
    const existsResult = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (existsResult.rowCount === 0) {
      console.log(`[db:create] Database '${dbName}' not found. Creating...`);
      await admin.query(`CREATE DATABASE "${dbName}"`);
      console.log('[db:create] Database created.');
    } else {
      console.log(`[db:create] Database '${dbName}' already exists.`);
    }
  } catch (e) {
    console.error('[ERROR] Failed while checking/creating database:', e);
    process.exitCode = 1;
  } finally {
    await admin.end();
  }
}

ensureDatabase();
