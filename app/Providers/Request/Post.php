<?php

namespace BookneticApp\Providers\Request;

//That's why generics...
class Post implements Request {
	public static function string( string $key, string $default = '', array $whiteList = [] ): string {
		if ( empty( $_POST[ $key ] ) ) {
			return $default;
		}

		$field = $_POST[ $key ];

		if ( ! is_string( $field ) ) {
			return $default;
		}

		$field = trim( stripslashes_deep( $field ) );

		if ( ! empty( $whiteList ) && ! in_array( $field, $whiteList ) ) {
			return $default;
		}

		return $field;
	}

	public static function int( string $key, int $default = 0, array $whiteList = [] ): int {
		if ( empty( $_POST[ $key ] ) ) {
			return $default;
		}

		$field = $_POST[ $key ];

		if ( ! is_numeric( $field ) ) {
			return $default;
		}

		if ( ! empty( $whiteList ) && ! in_array( $field, $whiteList ) ) {
			return $default;
		}

		return (int) $field;
	}

	public static function bool( string $key, bool $default = false ): bool {
		return ! empty( $_POST[ $key ] ) ?: $default ;
	}

	public static function array( string $key, array $default = [], array $whiteList = [] ): array {
		if ( empty( $_POST[ $key ] ) ) {
			return $default;
		}

		$field = $_POST[ $key ];

		if ( ! is_array( $field ) ) {
			return $default;
		}

		$field = stripslashes_deep( $field );

		if ( ! empty( $whiteList ) && ! in_array( $field, $whiteList ) ) {
			return $default;
		}

		return $field;
	}
}