### Usage
Here is an example:

``` html
<img src="blank.gif"  data-origsrc="original.jpg" data-jpegsrc="image.jpg" data-filtersrc="filter.png" width="200" height="200" alt="image alt">
```

``` js
$(function() {
  $("img").createAlphaJpeg();
});
```
