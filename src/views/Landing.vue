<template>
    <div class = "body">
        <div class="top_stripe"></div>
        <section id="Landing" class="landing">
            <img src="../assets/Gemini_Generated_Image_zi29uhzi29uhzi29 1.png" class="banner_image" />
            <div class="information_esq">
                <div class="selector">
                    <img src="../assets/Group 2.png"></img>
                    <div src="product_info">
                        <h1 class="Texto_opcao1">
                            Our Product
                        </h1>
                    </div>
                    <div class="about_us">
                        <h1 class="Texto_opcao2">
                            About Us
                        </h1>
                    </div>
                    <div class="contacts">
                        <h1 class="Texto_opcao3">
                            Contacts
                        </h1>
                    </div>
                </div>
            </div>
            <div class="information_dir">
            </div>
        </section>
    </div>
</template>

<style>
.body {
    background-color: white;
    display: grid;
    flex-direction: column;
    justify-content: center;
    height: auto;
    width: auto;
}

.top_stripe {
    background-color: #8B8B8BFF;
    width: 100%;
    padding-top: 0%;
    z-index: 9;
}

.banenr_image{
    z-index: 0;
}

.information_esq {
    background-color: #D9D9D9FF;
    height: 80%;
    width: 20%;
    margin-left: 0%;
}

</style>