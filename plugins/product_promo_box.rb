#
# Author: Balazs Nadasdi
#
# Outputs a string with a given attribution as a block about a Product Promotion
#
#   {% product_promo_box Bobby Willis http://google.com/search?q=pants the search for bobby's pants %}
#   Wheeee!
#   {% endblockquote %}
#   ...
#   <blockquote>
#     <p>Wheeee!</p>
#     <footer>
#     <strong>Bobby Willis</strong><cite><a href="http://google.com/search?q=pants">The Search For Bobby's Pants</a>
#   </blockquote>
#

module Jekyll

  class ProductPromoBox < Liquid::Block
    Title = /^Title: (.*)$/
    Author = /^Author: (.*)$/
    Source = /^Source: (.*)$/
    Url = /^Url: (.*)$/
    Price = /^Price: (.*)$/
    PromoPrice = /^PromoPrice: (.*)$/
    Image = /^Image: (.*)$/
    PromoCode = /^PromoCode: (.*)$/
    Description = /^Description: (.*)$/

    def initialize(tag_name, markup, tokens)
      @by = nil
      @title = nil
      @source = nil
      @url = nil
      @price = nil
      @promoPrice = nil
      @image = nil
      @promoCode = nil
      @description = nil

      tokens[0].split(/\n/).each do |line|
        line = line.strip
        next if (line.length < 1)

        if line =~ Title
          @title = $1
        elsif line =~ Author
          @by = $1
        elsif line =~ Source
          @source = $1
        elsif line =~ Url
          @url = $1
        elsif line =~ Price
          @price = $1
        elsif line =~ PromoPrice
          @promoPrice = $1
        elsif line =~ Image
          @image = $1
        elsif line =~ PromoCode
          @promoCode = $1
        elsif line =~ Description
          @description = $1
        end
      end

      super
    end

    def render(context)
      promo = "";
      promo += "<div class='product-title'>#{with_link(@title, @url)}</div>" unless @title.nil?
      promo += "<div class='product-source'>#{with_link(@source, @url)}</div>" unless @source.nil?
      promo += "<div class='product-author'>by <span>#{@by}</span></div>" unless @by.nil?
      if @promoPrice.nil?
        promo += "<div class='product-price'><span class='now'>#{@price}</span></div>" unless @price.nil?
      else
        promo += "<div class='product-price'><span class='old'>#{@price}</span> helyett <span class='now'>#{@promoPrice}</span></div>" unless @price.nil?
      end
      promo += "<div class='product-promo-code'>Prom&oacute;ci&oacute;s k&oacute;d: <span>#{@promoCode}</span></div>" unless @promoCode.nil?
      promo += "<div class='product-description'>#{@description}</div>" unless @description.nil?

      promo = "<div class='product-info'>#{promo}</div>";

      promo = with_link("<img class='product-image' src='#{@image}' alt='#{@title}' title='#{@title}'>", @url, @title) + "#{promo}" unless @image.nil?

      return "<div class='product-box'>#{promo}</div>"
    end

    def with_link(content, url, title = nil)
      return content if url.nil?

      title = content if title.nil?

      return "<a href='#{url}' title='#{title}'>#{content}</a>"
    end
  end
end

Liquid::Template.register_tag('product_promo_box', Jekyll::ProductPromoBox)
