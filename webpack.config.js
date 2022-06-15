const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

//todo: postcss(autoprefixer), watchers
module.exports = {
    // mode : 'production',
    entry : {
        app : {
            // dependOn : '',
            import: path.resolve(__dirname, 'src/scripts/index.js')
        }
    },
    output : {
        path : path.resolve(__dirname, 'dist/'),
        filename : '[name]_[contenthash].js',
        clean : true
    },
    devtool : 'source-map',
    module : {//loaders
        rules : [
            {
                test : /\.(css|scss)$/i,
                use : [
                    {loader:'style-loader', options:{}},
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',    
            }, 
        ]
    },
    plugins : [
        new htmlWebpackPlugin({
            title : 'webpack',
            filename : 'index.html',
            template : 'src/template.html'
        })
    ],
    devServer : {
        static : {
            directory : path.resolve(__dirname, 'dist')
        },
        port : 3000,
        hot : true,
        open : true,
        compress : false,
        // historyApiFallback : true,
        client: {
            reconnect: false,
            logging: 'error'
        }

    }
}