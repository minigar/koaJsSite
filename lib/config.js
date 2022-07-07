module.exports = {
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGO_URI || 'mongodb+srv://Dann:Dann@cluster0.17rjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    // mongoUri: 'mongodb+srv://Dann:Dann@cluster0.17rjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    secret: process.env.SECRET || 'secret',
    tokenLife: 3600 * 24,

    jwt: {
        secret: process.env.SECRET || 'secret',

        tokens: {
            access:{
                type: 'access',
                expiresIn: '51111111111111m'
            },
            refresh: {
                type: 'refresh',
                expiresIn: '71111111111111111m'
            }
        }
    }
}