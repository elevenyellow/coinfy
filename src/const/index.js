import styles from '/const/styles'

// asset types
export const TYPE_COIN = 'coin'
export const TYPE_ERC20 = 'erc20'

// info alerts colors
export const OK = styles.infoColor.green
export const ALERT = styles.infoColor.yellow
export const ERROR = styles.infoColor.red
export const NORMAL = styles.infoColor.grey

// networks
export const MAINNET = 0
export const TESTNET = 1

// state
export const KEYS_TO_REMOVE_WHEN_EXPORTING = ['state', 'summary', 'balance']

// timeouts
export const TIMEOUT_FETCH_PRICES = 30000 // 30 seconds
export const TIMEOUT_FETCH_SUMMARY = 60000 // 60 seconds
export const TIMEOUT_UPDATE_ALL_BALANCES = 60000 * 2 // 2 minutes
export const TIMEOUT_BETWEEN_EACH_GETBALANCE = 5000 // 5 seconds
export const TIMEOUT_BETWEEN_EACH_FAIL_FETCH_FEE = 10000 // 10 seconds

// others
export const minpassword = 8
export const recovery_phrase_words = 12
