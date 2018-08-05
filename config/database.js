if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb://arios91:Ar496139@ds161069.mlab.com:61069/vidjot-prod'
    }
}else{
    module.exports = {
        mongoURI: 'mongodb://localhost:27017/vidjot-dev'
    }
}