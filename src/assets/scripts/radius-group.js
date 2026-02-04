// $('#myswitch').on('switchChange.bootstrapSwitch', function (e, data) {
//     alert(e);
//     alert(data);
//     $('#myswitch').bootstrapSwitch('state', !data, true);
//     $('#showModal').modal({
//         backdrop: 'static',
//         keyboard: false
//     });

// });

// $("[name='myswitch']").bootstrapSwitch({
//     onSwitchChange: function (e, state) {
//         alert(e);
//         alert(state);
//     }
// });

function test() {
    alert("HI");
}

// Get the modal
var modal = document.getElementById('id01');
alert(modal);
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}