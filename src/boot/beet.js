// import something here
import beetjs from '@beetapp/beet-js/src'
// 'async' is optional
/*
    The name that will be displayed when connecting to beet
 */
const BEET_APP_NAME = 'Beet Discord Tipping'
/*
    Allowed chain to connect to (i.e. what accounts/chain the user can select from when connecting in Beet)
 */
const TARGET_CHAIN = 'BTS'

class Beet {
  constructor () {
    this._beet = beetjs.beet
    this._buffer = {}
    this._currentConnection = null
  }

  isInstalled () {
    if (!this._buffer.isInstalled) {
      let _tmp = new BufferedExecution(this._beet.isInstalled.bind(this._beet))
      this._buffer.isInstalled = _tmp
    }
    let buffer = this._buffer.isInstalled
    return buffer.execute()
  }

  disconnect () {
    if (this._currentConnection == null) {
      return
    }
    this._currentConnection.disconnect()
    this._currentConnection = null
  }

  getCurrentConnection () {
    return this._currentConnection
  }

  noBuffer () {
    return this._beet
  }

  connect () {
    if (!this._buffer.connect) {
      let _connect = () => {
        let thiz = this
        return new Promise((resolve, reject) => {
          thiz._beet.get(BEET_APP_NAME, TARGET_CHAIN).then(beetApp => {
            this._currentConnection = beetApp[TARGET_CHAIN]
            // fixme chain should get resolved in beet-js
            let _blockchains = {
              BTS: {
                coreSymbol: 'BTS',
                name: 'BitShares'
              },
              BTS_TEST: {
                coreSymbol: 'TEST',
                name: 'BitShares',
                testnet: true
              },
              STEEM: {
                coreSymbol: 'STM',
                name: 'Steem'
              },
              WLS: {
                coreSymbol: 'WLS',
                name: 'WhaleShares'
              },
              SMOKE: {
                coreSymbol: 'SMK',
                name: 'Smoke'
              },
              EOS: {
                coreSymbol: 'EOS',
                name: 'EOSmainnet'
              },
              TLOS: {
                coreSymbol: 'TLOS',
                name: 'Telos'
              },
              BTC: {
                coreSymbol: 'BTC',
                name: 'Bitcoin'
              },
              BTC_TEST: {
                coreSymbol: 'BTC',
                name: 'Bitcoin',
                testnet: true
              },
              BNB_TEST: {
                coreSymbol: 'BNB',
                name: 'BinanceChain',
                testnet: true
              },
              BNB: {
                coreSymbol: 'BNB',
                name: 'BinanceChain'
              }
            }
            this._currentConnection.identity.account.chain = _blockchains[this._currentConnection.identity.chain]
            resolve(this._currentConnection)
          }).catch(reject)
        })
      }
      let _tmp = new BufferedExecution(_connect.bind(this))
      this._buffer.connect = _tmp
    }
    return this._buffer.connect.execute()
  }
}

class BufferedExecution {
  constructor (actualCall) {
    this._executionInProgress = false
    this._resolves = []
    this._rejects = []
    this._actualCall = actualCall
    this._result = null
  }

  execute () {
    if (this._executionInProgress) {
      return new Promise((resolve, reject) => {
        this._resolves.push(resolve)
        this._rejects.push(reject)
      })
    } else {
      this._executionInProgress = true
      if (this._result != null) {
        return new Promise((resolve, reject) => {
          this._resolves.push(resolve)
          this._rejects.push(reject)
          this._onResolve(this._result)
        })
      } else {
        return new Promise((resolve, reject) => {
          this._resolves.push(resolve)
          this._rejects.push(reject)
          this._actuallyExecute()
        })
      }
    }
  }

  _onResolve (argument) {
    this._executionInProgress = false
    this._result = argument
    this._resolves.forEach((resolve) => {
      resolve(argument)
    })
    this._resolves = []
  }

  _onError (err) {
    this._executionInProgress = false
    this._rejects.forEach((reject) => {
      reject(err)
    })
    this._rejects = []
  }
  _actuallyExecute () {
    this._actualCall().then(this._onResolve.bind(this)).catch(this._onError.bind(this))
  }
}
export default async ({
  Vue
}) => {
  // something to do
  const beeet = new Beet()
  Vue.prototype.$beet = beeet
}
