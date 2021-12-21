// wrapper 사용 (데코레이터 패턴)
module.exports = asyncFn => {
    return (async (req, res, next) => {
        try {
            return await asyncFn(req, res, next)
        } catch (error) {
            return next(error)
        }
    })
}
//사용법
// router.get('/', wrap(async (req, res, next) => {
//     const result = await foo();
//     res.send(result);
// }))