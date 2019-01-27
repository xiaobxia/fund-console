#react架手架
编写的注意点  
1.withRouter要包在connect外面
2.同时用form和withRouter包裹以后都会每次的props都是不一样的
3.router-view每次都会重新渲染，所以需要拆分成更小粒度来优化
