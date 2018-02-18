define(['base/js/namespace', 'base/js/events'], function(Jupyter, events){

    _SAVE_HOOKS_TEMPLATE = `
    <li class="dropdown">
      <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Save options</a>
      <ul id="save_hooks" class="dropdown-menu">
          <li title="Save the notebook with the widget state information for static rendering">
            <a href="#"><input type="checkbox" data-mime-key="text/html">Strip HTML</a>
          </li>
          <li title="Save the notebook with the widget state information for static rendering">
            <a href="#"><input type="checkbox" data-mime-key="application/tidy+json">Strip Custom mime</a>
          </li>
        </ul>
    </li>`;
    let clear_mimes = new Set();
    function load_ipython_extension(){
        // Add a menu to the toolbar
        $('#help_menu').parent().before(_SAVE_HOOKS_TEMPLATE);
        
        // A reference to the save-hook
        var saveCb = function() {
            console.log('saving the notebook');
            console.log('Should remove these mimes', clear_mimes);
            let cells_with_output = Jupyter.notebook.get_cells().filter((cell) => cell.output_area && cell.output_area.outputs.length > 0);
            cells_with_output.forEach((cell) => {
                cell.output_area.outputs.forEach((output) => {
                    clear_mimes.forEach((mime) => {
                        delete output.data[mime];
                    });
                })
            });            
        }

        events.on('before_save.Notebook', saveCb);
        $('.dropdown :checkbox').change(function () {
            let mime = $(this).data('mime-key');
            if ($(this).is(':checked')) {
                console.log( + ' is now checked');
                clear_mimes.add(mime);
            } else {
                console.log($(this).val() + ' is now unchecked');
                clear_mimes.delete(mime);
            }
        });
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});

