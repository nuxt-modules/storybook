// ~/server/function.ts

export default (req, res, next) => {
    if(req.url === '/express3') {
        res.write("Works")
        res.end()
        return
    }
    next()
}