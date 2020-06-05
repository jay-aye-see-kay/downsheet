# DSC (the downsheeet calculator)

The is a first attempt at an implementation of `dsc`. It's job is to take a valid downsheet file format it, and update its values based on any formula it might have.


## Set up
Caution: the following is a hacky development set up, use at your own risk! I'll put it on npm once it's closer to done.

From this directory run:

- `npm install`
- `npm run devBuild`

This will install the JS, transpile TS to JS, and install it using `npm link`. I'm currently developing it in vim, you can add the following to your `.vimrc` to enable syntax highlighting and format on save.

```vimL
augroup downsheet
  autocmd!
  autocmd BufRead,BufNewFile *.dsh set filetype=toml
  autocmd BufRead,BufNewFile *.dsh set nowrap
  autocmd BufWritePre *.dsh :%!dsc
augroup END
```

## TODO
TODO
