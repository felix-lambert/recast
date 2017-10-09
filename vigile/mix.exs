defmodule Vigile.Mixfile do
  use Mix.Project

  def project do
    [app: :vigile,
     version: "0.1.0",
     elixir: "~> 1.4",
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps()]
  end

  def application do
    [extra_applications: [:logger],
     mod: {Vigile.Application, [:cowboy, :plug, :httpoison]}]
  end

  defp deps do
    [
      {:plug, "~> 1.0"},
      {:poison, "~> 3.1"},
      {:cowboy, "~> 1.0.0"},
      {:httpoison, "~> 0.12"},
      {:dogma, "~> 0.1", only: :dev},
    ]
  end
end
