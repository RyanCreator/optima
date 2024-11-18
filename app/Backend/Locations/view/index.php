<?php

defined( 'ABSPATH' ) or die();

use BookneticApp\Providers\Helpers\Helper;
use BookneticApp\Providers\Helpers\Date;

/**
 * @var mixed $parameters
 */

echo $parameters['table'];
$apiKey = Helper::getOption('google_maps_api_key', '', false);
?>
<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?key=<?php echo urlencode( $apiKey )?>" async defer></script>
<script type="text/javascript" src="<?php echo Helper::assets('js/locations.js', 'Locations')?>"></script>