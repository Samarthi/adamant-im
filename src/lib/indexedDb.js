import idb from 'idb'
import ed2curve from 'ed2curve'
import nacl from 'tweetnacl/nacl-fast'
import {decode} from '@stablelib/utf8'

const DATABASE_NAME = 'adm'
const DEFAULT_KEY_PATH = 'name'
const READWRITE = 'readwrite'
const READONLY = 'readonly'
const TO_STRING_TRANSFORM_TYPE = 'hex'
const NONCE = Buffer.allocUnsafe(24)

const SECURITY = 'security'
const PASSPHRASE = 'passPhrase'
const USER_PASSWORD = 'userPassword'

export function getAdmDataBase () {
  return idb.open(DATABASE_NAME, 1, function (upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains(SECURITY)) {
      upgradeDb.createObjectStore(SECURITY, {keyPath: DEFAULT_KEY_PATH, autoIncrement: true})
    }
  })
}

export function updateUserPassword (db, value) {
  const userPassword = {
    name: USER_PASSWORD,
    value: value
  }
  return saveValueByName(db, SECURITY, userPassword)
}

export function updatePassPhrase (db, value) {
  const passPhrase = {
    name: PASSPHRASE,
    value: value
  }
  return saveValueByName(db, SECURITY, passPhrase)
}

export function getPassPhrase (db) {
  return getValueByName(db, SECURITY, PASSPHRASE)
}

export function getUserPassword (db) {
  return getValueByName(db, SECURITY, USER_PASSWORD)
}

export function encryptData (data) {
  return getAdmDataBase().then((db) => {
    return getUserPassword(db).then((userPassword) => {
      const secretKey = ed2curve.convertSecretKey(userPassword.value.toString(TO_STRING_TRANSFORM_TYPE))
      return nacl.secretbox(Buffer.from(data), NONCE, secretKey)
    })
  })
}

export function decryptData (encryptedData) {
  return getAdmDataBase().then((db) => {
    return getUserPassword(db).then((userPassword) => {
      const secretKey = ed2curve.convertSecretKey(userPassword.value.toString(TO_STRING_TRANSFORM_TYPE))
      return decode(nacl.secretbox.open(encryptedData, NONCE, secretKey))
    })
  })
}

function saveValueByName (db, storeObject, value) {
  const transaction = db.transaction(storeObject, READWRITE)
  const store = transaction.objectStore(storeObject)
  store.put(value)
  return transaction.complete
}

function getValueByName (db, storeObject, name) {
  const transaction = db.transaction(storeObject, READONLY)
  const store = transaction.objectStore(storeObject)
  return store.get(name)
}
