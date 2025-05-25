{ pkgs ? import <nixpkgs> {} }:
let
  stablePkgs = import (fetchTarball {
    # stable 25.05 @ 2025.05.25 https://github.com/NixOS/nixpkgs/tree/55d1f923c480dadce40f5231feb472e81b0bab48
    url = "https://github.com/NixOS/nixpkgs/tarball/55d1f923c480dadce40f5231feb472e81b0bab48";
    sha256 = "0i0ayb1p7ypbjnjf837qlfn6n3i3468cvalha54yakjdi6a6srnb";
  }) { };
  packages = with stablePkgs; [
    deno
  ];
in
pkgs.mkShell {
    inherit packages;
} 