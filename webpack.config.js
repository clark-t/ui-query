module.exports = {
    entry: {
        index: './index.js'
    },
    output: {
        path: './dist',
        filename: 'ui-query.min.js',
        library: '$',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
