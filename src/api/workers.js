// Experimental function (doesn't work as expected)
// https://github.com/developit/workerize
export function createWorker(f) {
    function run() {
        const that = this
        self.addEventListener('message', function(e) {
            const args = e.data
            console.log(self, this, parent)
            self.postMessage(args.length)
        })
    }

    const blobURL = URL.createObjectURL(
        new Blob(['(', run.toString(), ')()'], {
            type: 'application/javascript'
        })
    )

    return new Worker(blobURL)
}
