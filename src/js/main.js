/**
 * jTinder initialization
 */
$("#tinderslide").jTinder({
	// dislike callback
    onDislike: function (item) {
	    // set the status text
        $('#status').html('Dislike image ' + (item.index()+1));
    },
	// like callback
    onLike: function (item) {
	    // set the status text
        $('#status').html('Like image ' + (item.index()+1));
    },
	animationRevertSpeed: 200,
	animationSpeed: 400,
	threshold: 1,
	likeSelector: '.like',
	dislikeSelector: '.dislike'
});

/**
 * Set button action to trigger jTinder like & dislike.
 */
$('.actions .like, .actions .dislike').click(function(e){
	e.preventDefault();
	$("#tinderslide").jTinder($(this).attr('class'));
});

$(document).ready(function(){
$('.fb.btn').click(function(e){
  e.preventDefault();

  var obj = {
    method: 'feed',
    display: 'popup',    
    link: 'https://www.shackormansion.com',
    source: 'https://shack-or-mansion.firebaseapp.com/img/share.jpg',
    //name: 'Shack or Mansion',
    //caption: 'Reference Documentation',
    //description: 'Using Dialogs to interact with people.'
  };

  function callback(response) {
    console.log(response);
  }

  FB.ui(obj, callback);
  /*
    FB.ui(
    {
    method: 'feed',
    name: 'Shack or Mansion',
    link: 'https://shackormansion.com',
    picture: 'https://shackormansion.com/img/share.jpg',
    caption: 'Can you tell the difference between a shack and a mansion',
    description: 'This is the desc',
    });
    */
  });
});
