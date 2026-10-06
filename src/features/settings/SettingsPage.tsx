import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import {
  checkBackupFile,
  downloadBackup,
  replaceDataWithBackup,
  type BackupProblem,
  type CheckedBackup,
} from '../../services/backupService'
import { getPersistenceStatus, getStoredDataProblem, type PersistenceStatus } from '../../services/appDataService'
import styles from './SettingsPage.module.css'

// Settings v0.1 (M1): backup export / import. Soft goals arrive with Me (M4).
// All Hebrew copy here is a DRAFT for Noa's review.

type ImportState =
  | { step: 'idle' }
  | { step: 'checking' }
  | { step: 'rejected'; problem: BackupProblem }
  | { step: 'confirm'; backup: Extract<CheckedBackup, { ok: true }> }
  | { step: 'restored' }
  | { step: 'failed' }

const problemText: Record<BackupProblem, string> = {
  'not-json': 'הקובץ הזה לא נראה כמו גיבוי של NoaOS.',
  'not-noaos': 'הקובץ הזה לא נראה כמו גיבוי של NoaOS.',
  'unsupported-version': 'הגיבוי הזה נוצר בגרסה אחרת של NoaOS, שהגרסה הזו לא יודעת לקרוא.',
  'invalid-data': 'הגיבוי הזה פגום, ולכן אי אפשר לשחזר ממנו.',
}

const persistenceText: Record<PersistenceStatus, string | null> = {
  persisted: 'הדפדפן הזה שומר את המידע של NoaOS לאורך זמן.',
  'not-persisted': 'הדפדפן עלול לפנות את המידע אם יחסר מקום במחשב — עוד סיבה לשמור גיבוי.',
  unsupported: null,
}

const dateFormat = new Intl.DateTimeFormat('he-IL', { dateStyle: 'long', timeStyle: 'short' })

export default function SettingsPage() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [importState, setImportState] = useState<ImportState>({ step: 'idle' })
  const [exportFailed, setExportFailed] = useState(false)
  const [dataProblem, setDataProblem] = useState(() => getStoredDataProblem())
  const [persistence, setPersistence] = useState<PersistenceStatus>('unsupported')

  useEffect(() => {
    document.title = 'הגדרות · NoaOS'
    getPersistenceStatus().then(setPersistence)
  }, [])

  function handleExport() {
    try {
      downloadBackup()
      setExportFailed(false)
    } catch (error) {
      console.error('NoaOS: export failed', error)
      setExportFailed(true)
    }
  }

  async function handleFileChosen(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow choosing the same file again
    if (!file) return

    setImportState({ step: 'checking' })
    const checked = await checkBackupFile(file)
    if (checked.ok) {
      setImportState({ step: 'confirm', backup: checked })
    } else {
      console.warn('NoaOS: backup rejected —', checked.detail)
      setImportState({ step: 'rejected', problem: checked.problem })
    }
  }

  function handleConfirmReplace() {
    if (importState.step !== 'confirm') return
    try {
      replaceDataWithBackup(importState.backup.data)
      setImportState({ step: 'restored' })
      setDataProblem(getStoredDataProblem())
    } catch (error) {
      console.error('NoaOS: restore failed', error)
      setImportState({ step: 'failed' })
    }
  }

  const persistenceNote = persistenceText[persistence]

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>הגדרות</h1>
        <p className={styles.description}>גיבוי של המידע. יעדים יומיים למים ולצעדים יגיעו לכאן בהמשך.</p>
      </header>

      <section className={styles.panel} aria-labelledby="backup-heading">
        <h2 id="backup-heading" className={styles.panelHeading}>גיבוי</h2>
        <p className={styles.text}>
          כל המידע של NoaOS נשמר רק בדפדפן הזה, במכשיר הזה. קובץ גיבוי שומר עותק שלו — וממנו אפשר לשחזר.
        </p>

        {dataProblem && (
          <p className={styles.notice} role="alert">
            אי אפשר היה לקרוא את המידע השמור בדפדפן. הוא נשאר כמו שהוא — אפשר לשחזר מגיבוי.
          </p>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={handleExport} disabled={!!dataProblem}>
            ייצוא גיבוי
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => fileInput.current?.click()}
            disabled={importState.step === 'checking'}
          >
            שחזור מגיבוי…
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className={styles.hiddenInput}
            onChange={handleFileChosen}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        {exportFailed && (
          <p className={styles.notice} role="alert">
            הייצוא לא הצליח. המידע לא השתנה.
          </p>
        )}

        <div aria-live="polite">
          {importState.step === 'rejected' && (
            <p className={styles.notice}>{problemText[importState.problem]} שום דבר לא השתנה.</p>
          )}

          {importState.step === 'confirm' && (
            <div className={styles.confirm}>
              <p className={styles.confirmTitle}>להחליף את המידע הנוכחי בגיבוי הזה?</p>
              <ul className={styles.summary}>
                <li>
                  נוצר ב־{dateFormat.format(new Date(importState.backup.summary.exportedAt))}
                </li>
                <li>ימים שמורים בגיבוי: {importState.backup.summary.dayCount}</li>
              </ul>
              <p className={styles.text}>כל המידע שנמצא עכשיו בדפדפן הזה יוחלף בתוכן הגיבוי.</p>
              <div className={styles.actions}>
                <button type="button" className={styles.primaryButton} onClick={handleConfirmReplace}>
                  להחליף את המידע
                </button>
                <button type="button" className={styles.secondaryButton} onClick={() => setImportState({ step: 'idle' })}>
                  ביטול
                </button>
              </div>
            </div>
          )}

          {importState.step === 'restored' && <p className={styles.success}>המידע שוחזר מהגיבוי.</p>}

          {importState.step === 'failed' && (
            <p className={styles.notice} role="alert">
              השחזור לא הצליח, והמידע הקודם נשאר כמו שהיה.
            </p>
          )}
        </div>

        {persistenceNote && <p className={styles.footnote}>{persistenceNote}</p>}
      </section>
    </div>
  )
}
