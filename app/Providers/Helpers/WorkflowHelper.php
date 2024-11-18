<?php

namespace BookneticApp\Providers\Helpers;

use BookneticApp\Models\WorkflowLog;
use BookneticApp\Providers\Core\Permission;
use BookneticSaaS\Models\TenantBilling;

class WorkflowHelper
{
    public static function getUsage( string $driverName ): int
    {
        if( Helper::isSaaSVersion() )
        {
            $lastPayment = TenantBilling::where('event_type', 'in', ['subscribed', 'payment_received'])
                                        ->orderBy('id DESC')
                                        ->limit(1)
                                        ->fetch();

            $startDatetime = Date::dateTimeSQL( $lastPayment ? $lastPayment->created_at : 'now' );
        }
        else
        {
            $startDatetime = Date::dateTimeSQL();
        }

        return WorkflowLog::where( 'driver', $driverName )
            ->where( 'date_time', '>=', $startDatetime )
            ->count();
    }
}