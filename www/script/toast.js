const agToast = ( function() {

    let domTitle = $('#toastTitle');
    let domMsg = $('#toastMsg');

    function
    show(opts) 
    {
        domTitle.text(opts?.title);
        domMsg.text(opts?.msg);

        let toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('liveToast'));
        toast.show();
    }

    return {
        show
    };

} )();
