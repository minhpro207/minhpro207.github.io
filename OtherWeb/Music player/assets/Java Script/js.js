const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const  PLAYER_STORAGE_KEY = 'MSPLAYER'

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    songs: [
        {
            name: 'Headlong',
            singer: 'The Queen',
            path: './assets/music/song1.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: 'We will rockyou',
            singer: 'The Queen',
            path: './assets/music/song2.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name: 'Somebody to love',
            singer: 'The Queen',
            path: './assets/music/song3.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: 'Radio ga ga',
            singer: 'The Queen',
            path: './assets/music/song4.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: 'Love of my life',
            singer: 'The Queen',
            path: './assets/music/song5.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name: 'Its a hard life',
            singer: 'The Queen',
            path: './assets/music/song6.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: 'Innuendo',
            singer: 'The Queen',
            path: './assets/music/song7.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name: 'I\'m Going Slightly Mad',
            singer: 'The Queen',
            path: './assets/music/song8.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: 'Breakthru',
            singer: 'The Queen',
            path: './assets/music/song9.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name: 'I want it all',
            singer: 'The Queen',
            path: './assets/music/song10.mp3',
            image: './assets/img/img1.jpg'
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this //gan bien _this bang bien this(app) ben ngoai
        const cdWidth = cd.offsetWidth

        //Xoay CD
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 sec
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Phong to, thu nho dia CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xu ly nut play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }else{
                audio.play()
            }
        }

        //Khi song play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Khi song pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent
            }
        }

        //Xu ly khi tua bai hat
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //Bam next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Bam prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Active random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            //                          classList,      Boolean true thi add, false thi remove
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Active repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)

            //                          classList,      Boolean true thi add, false thi remove
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xy ly next song khi audio end
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        //choose song on screen
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')

            
            //neu khong phai active hoac no la option thi duyet
            if (songNode || e.target.closest('.option') ) {
                //Xu ly khi click vao bai hat trong list
                if(songNode){
                    // console.log(songNode.getAttribute('data-index'))
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //Xu ly khi click vao option
                if(e.target.closest('.option')){

                }
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        //Load local stogage 
        this.loadConfig()

        //Dinh nghia cac thuoc tinh cho object
        this.defineProperties()

        //Lang nghe / Xu ly cac su kien DOM events
        this.handleEvents()

        //Tai thong tin bai hat dau tien len dia CD khi bat web
        this.loadCurrentSong()

        //Render playlist
        this.render()
        
        //Hien thi trang thai ban dau cua repeat vs random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)

    }

}
    app.start()